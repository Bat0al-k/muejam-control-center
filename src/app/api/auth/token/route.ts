import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { authenticateUser } from "@/features/auth/auth.service";
import { executeGraphQL } from "@/graphql/client";
import { UPSERT_USER_ACTIVITY } from "@/graphql/queries/studio/users";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

        if (!email || !password) {
            return NextResponse.json(
                {
                    message: "Email and password are required.",
                },
                { status: 400 }
            );
        }

        const user = await authenticateUser(email, password);

        // Multi-Schema Login Tracking & Suspension Validation (PDF Section 2.3.1)
        const requestedProduct =
            body.product === "studio" || body.product === "library"
                ? body.product
                : user.role === "admin"
                ? "studio"
                : "library";

        try {
            const activityRes = await executeGraphQL<{
                auth_user_activity_by_pk: {
                    account_status: string;
                } | null;
            }>(
                `
                query GetUserActivityOnLogin($userId: uuid!) {
                    auth_user_activity_by_pk(user_id: $userId) {
                        account_status
                    }
                }
                `,
                { userId: user.id },
            );

            if (activityRes.auth_user_activity_by_pk?.account_status === "suspended") {
                return NextResponse.json(
                    { message: "This account is suspended." },
                    { status: 403 },
                );
            }

            const nowIso = new Date().toISOString();
            const userAgent =
                request.headers.get("user-agent") || "Muejam Browser Client";
            const ipAddress =
                request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                request.headers.get("x-real-ip") ||
                null;

            await executeGraphQL(UPSERT_USER_ACTIVITY, {
                userId: user.id,
                product: requestedProduct,
                accountStatus: "active",
                now: nowIso,
            });

            const sessionTable =
                requestedProduct === "library"
                    ? "libaray_user_sessions"
                    : "Voice_Studio_user_sessions";

            await executeGraphQL(
                `
                mutation RecordLoginSession(
                    $userId: uuid!
                    $now: timestamptz!
                    $userAgent: String
                    $ipAddress: String
                ) {
                    update_auth_users_by_pk(
                        pk_columns: { id: $userId }
                        _set: { last_seen: $now }
                    ) {
                        id
                    }
                    insert_${sessionTable}_one(
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
                    userId: user.id,
                    now: nowIso,
                    userAgent,
                    ipAddress,
                },
            );
        } catch (trackErr) {
            console.error("Login activity tracking warning:", trackErr);
        }

        /**
         * The JWT secret must stay server-side.
         */
        const jwtSecretRaw = process.env.HASURA_GRAPHQL_JWT_SECRET;

        if (!jwtSecretRaw) {
            console.error(
                "HASURA_GRAPHQL_JWT_SECRET is not configured."
            );

            return NextResponse.json(
                {
                    message: "Authentication configuration error.",
                },
                { status: 500 }
            );
        }

        let jwtSecret: {
            key: string;
        };

        try {
            jwtSecret = JSON.parse(jwtSecretRaw);
        } catch {
            console.error(
                "HASURA_GRAPHQL_JWT_SECRET contains invalid JSON."
            );

            return NextResponse.json(
                {
                    message: "Authentication configuration error.",
                },
                { status: 500 }
            );
        }

        if (!jwtSecret.key) {
            return NextResponse.json(
                {
                    message: "Authentication configuration error.",
                },
                { status: 500 }
            );
        }

        /**
         * Hasura JWT claims.
         *
         * We keep the same JWT structure used by the Main Project.
         */
        const claims = {
            "https://hasura.io/jwt/claims": {
                "x-hasura-allowed-roles": [user.role],
                "x-hasura-default-role": user.role,
                "x-hasura-user-id": user.id,
            },
        };

        /**
         * Authentication session expires after 7 days.
         *
         * The password itself does NOT expire here.
         */
        const accessToken = jwt.sign(
            claims,
            jwtSecret.key,
            {
                algorithm: "HS256",
                expiresIn: "7d",
            }
        );

        /**
         * The token is stored only in an HttpOnly cookie.
         *
         * JavaScript in the browser cannot read this cookie.
         */
        const response = NextResponse.json({
            // for user data in local storage 

            user,
        });

        response.cookies.set({
            name: "token",
            value: accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SESSION_DURATION_SECONDS,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Unable to login.";

        /**
         * Don't expose internal database/GraphQL errors.
         */
        if (
            message === "Invalid email or password." ||
            message === "This account is disabled." ||
            message === "This account does not have a password yet."
        ) {
            return NextResponse.json(
                { message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                message: "Unable to login. Please try again.",
            },
            { status: 500 }
        );
    }
}