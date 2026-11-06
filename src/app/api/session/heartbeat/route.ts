import { NextRequest, NextResponse } from "next/server";
import { getCurrentAuth } from "@/lib/server-auth";
import { executeGraphQL } from "@/graphql/client";
import { TERMINATE_USER_ALL_SESSIONS } from "@/graphql/queries/studio/users";

const CHECK_USER_STATUS = `
    query CheckUserStatusForHeartbeat($userId: uuid!) {
        auth_users_by_pk(id: $userId) {
            id
            disabled
        }
        auth_user_activity_by_pk(user_id: $userId) {
            user_id
            account_status
            last_login_product
        }
    }
`;

export async function POST(request: NextRequest) {
    try {
        const auth = await getCurrentAuth();
        if (!auth) {
            return NextResponse.json(
                { success: false, isOnline: false, message: "Authentication required" },
                { status: 401 },
            );
        }

        const body = await request.json().catch(() => ({}));
        const product: "studio" | "library" =
            body.product === "library" ? "library" : "studio";
        const sessionId =
            typeof body.sessionId === "string" && body.sessionId.trim()
                ? body.sessionId.trim()
                : null;

        const nowIso = new Date().toISOString();
        const userAgent = request.headers.get("user-agent") || "Muejam Browser Client";
        const ipAddress =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            null;

        // 1. Suspension Enforcement (PDF Section 2.3.2 & 2.5)
        const statusData = await executeGraphQL<{
            auth_users_by_pk: { id: string; disabled: boolean } | null;
            auth_user_activity_by_pk: {
                user_id: string;
                account_status: string;
                last_login_product: string;
            } | null;
        }>(CHECK_USER_STATUS, { userId: auth.userId });

        const dbUser = statusData.auth_users_by_pk;
        const dbActivity = statusData.auth_user_activity_by_pk;

        if (
            !dbUser ||
            dbUser.disabled ||
            dbActivity?.account_status === "suspended"
        ) {
            await executeGraphQL(TERMINATE_USER_ALL_SESSIONS, {
                userId: auth.userId,
                now: nowIso,
            }).catch(() => {});

            return NextResponse.json(
                {
                    success: false,
                    isOnline: false,
                    message: "Account is suspended. Session terminated.",
                },
                { status: 403 },
            );
        }

        // 2. Record / update session heartbeat in the appropriate schema
        const sessionTable =
            product === "library"
                ? "libaray_user_sessions"
                : "Voice_Studio_user_sessions";

        let activeSessionId = sessionId;

        if (activeSessionId) {
            const updateRes = await executeGraphQL<
                Record<string, { id: string } | null>
            >(
                `
                mutation UpdateSessionHeartbeat($id: uuid!, $now: timestamptz!) {
                    updated: update_${sessionTable}_by_pk(
                        pk_columns: { id: $id }
                        _set: { last_seen: $now, ended_at: null }
                    ) {
                        id
                    }
                }
                `,
                { id: activeSessionId, now: nowIso },
            ).catch(() => null);

            if (!updateRes?.updated) {
                activeSessionId = null;
            }
        }

        if (!activeSessionId) {
            // Check if there is already an open session for this user in this schema
            const existingOpen = await executeGraphQL<
                Record<string, { id: string }[]>
            >(
                `
                query FindOpenSession($userId: uuid!) {
                    sessions: ${sessionTable}(
                        where: { user_id: { _eq: $userId }, ended_at: { _is_null: true } }
                        order_by: { last_seen: desc }
                        limit: 1
                    ) {
                        id
                    }
                }
                `,
                { userId: auth.userId },
            ).catch(() => ({ sessions: [] }));

            const foundId = existingOpen.sessions?.[0]?.id;

            if (foundId) {
                activeSessionId = foundId;
                await executeGraphQL(
                    `
                    mutation TouchOpenSession($id: uuid!, $now: timestamptz!) {
                        update_${sessionTable}_by_pk(
                            pk_columns: { id: $id }
                            _set: { last_seen: $now }
                        ) {
                            id
                        }
                    }
                    `,
                    { id: foundId, now: nowIso },
                ).catch(() => {});
            } else {
                const insertRes = await executeGraphQL<
                    Record<string, { id: string } | null>
                >(
                    `
                    mutation CreateSession(
                        $userId: uuid!
                        $now: timestamptz!
                        $userAgent: String
                        $ipAddress: String
                    ) {
                        created: insert_${sessionTable}_one(
                            object: {
                                user_id: $userId
                                started_at: $now
                                last_seen: $now
                                user_agent: $userAgent
                                ip_address: $ipAddress
                            }
                        ) {
                            id
                        }
                    }
                    `,
                    {
                        userId: auth.userId,
                        now: nowIso,
                        userAgent,
                        ipAddress,
                    },
                ).catch(() => null);

                activeSessionId = insertRes?.created?.id ?? null;
            }
        }

        // 3. Update auth.users.last_seen and auth.user_activity.updated_at
        await executeGraphQL(
            `
            mutation TouchUserSeen($userId: uuid!, $now: timestamptz!, $product: String!) {
                update_auth_users_by_pk(
                    pk_columns: { id: $userId }
                    _set: { last_seen: $now }
                ) {
                    id
                }
                insert_auth_user_activity_one(
                    object: {
                        user_id: $userId
                        last_login_at: $now
                        last_login_product: $product
                        account_status: "active"
                        updated_at: $now
                    }
                    on_conflict: {
                        constraint: user_activity_pkey
                        update_columns: [updated_at]
                    }
                ) {
                    user_id
                }
            }
            `,
            { userId: auth.userId, now: nowIso, product },
        ).catch(() => {});

        return NextResponse.json({
            success: true,
            isOnline: true,
            sessionId: activeSessionId,
        });
    } catch (error) {
        console.error("Session heartbeat error:", error);
        return NextResponse.json(
            { success: false, isOnline: false, message: "Heartbeat failed" },
            { status: 500 },
        );
    }
}

