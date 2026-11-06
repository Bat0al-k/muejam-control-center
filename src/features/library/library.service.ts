import { executeGraphQL } from "@/graphql/client";
import {
    GET_ALL_USERS_WITH_ACTIVITY,
    GET_LIBRARY_USER_DETAILS,
} from "@/graphql/queries/library/users";
import type { AllUsersWithActivityResponse } from "@/features/studio/studio.service";

const PRESENCE_WINDOW_MS = 90 * 1000; // 90 seconds per USER_ACTIVITY_AND_LTS_UPDATES.pdf

export interface LibraryUser {
    id: string;
    displayName: string;
    email: string;
    lastSeen: string | null;
    onlineAt: string | null;
    offlineAt: string | null;
    lastLoginAt: string | null;
    phoneNumber: string | null;
    emailVerified: boolean;
    disabled: boolean;
    accountStatus: "active" | "suspended";
    product: "studio" | "library";
    role: string;
    defaultRole: string;
    bookCount: number;
    projectCount: number;
    sessionCount: number;
    isAuthorProfile: boolean;
    authorName: string | null;
    online: boolean;
}

export interface LibraryUsersData {
    users: LibraryUser[];
    totalAccounts: number;
    activeUsers: number;
    suspendedUsers: number;
    onlineUsers: number;
    offlineUsers: number;
    verifiedEmails: number;
    authorAccounts: number;
    readerAccounts: number;
    isolatedStudioAccounts: number;
    totalPlatformAccounts: number;
}

export async function getLibraryUsers(): Promise<LibraryUsersData> {
    const data = await executeGraphQL<AllUsersWithActivityResponse>(
        GET_ALL_USERS_WITH_ACTIVITY,
    );

    const projectsCount = new Map<string, number>();
    for (const project of data.Voice_Studio_projects) {
        projectsCount.set(
            project.user_id,
            (projectsCount.get(project.user_id) ?? 0) + 1,
        );
    }

    const studioSessionsCount = new Map<string, number>();
    for (const s of data.Voice_Studio_user_sessions) {
        studioSessionsCount.set(
            s.user_id,
            (studioSessionsCount.get(s.user_id) ?? 0) + 1,
        );
    }

    const activityMap = new Map(
        data.auth_user_activity.map((item) => [item.user_id, item]),
    );

    const libPresenceMap = new Map(
        data.libaray_user_presence.map((item) => [item.user_id, item]),
    );

    const libSessionsMap = new Map<
        string,
        AllUsersWithActivityResponse["libaray_user_sessions"]
    >();
    for (const session of data.libaray_user_sessions) {
        const list = libSessionsMap.get(session.user_id) ?? [];
        list.push(session);
        libSessionsMap.set(session.user_id, list);
    }

    const authorMap = new Map<
        string,
        { authorName: string; bookCount: number }
    >();
    for (const author of data.libaray_Autor) {
        if (!author.user_id) continue;
        const existing = authorMap.get(author.user_id);
        if (existing) {
            existing.bookCount += author.book_num ?? 0;
        } else {
            authorMap.set(author.user_id, {
                authorName: author.name,
                bookCount: author.book_num ?? 0,
            });
        }
    }

    const now = Date.now();
    const libraryUsers: LibraryUser[] = [];
    let isolatedStudioAccounts = 0;

    for (const user of data.auth_users) {
        const activity = activityMap.get(user.id);
        const userProjects = projectsCount.get(user.id) ?? 0;
        const userStudioSess = studioSessionsCount.get(user.id) ?? 0;

        // Strict product separation per USER_ACTIVITY_AND_LTS_UPDATES.pdf
        let product: "studio" | "library";
        if (
            activity?.last_login_product === "studio" ||
            activity?.last_login_product === "library"
        ) {
            product = activity.last_login_product;
        } else if (
            user.default_role === "admin" ||
            user.default_role === "me" ||
            userProjects > 0 ||
            userStudioSess > 0
        ) {
            product = "studio";
        } else {
            product = "library";
        }

        if (product !== "library") {
            isolatedStudioAccounts += 1;
            continue;
        }

        const presence = libPresenceMap.get(user.id);
        const userLibSessions = libSessionsMap.get(user.id) ?? [];
        const latestSession = userLibSessions[0] ?? null;
        const authorInfo = authorMap.get(user.id);

        const accountStatus: "active" | "suspended" =
            user.disabled || activity?.account_status === "suspended"
                ? "suspended"
                : "active";

        const isDisabled = user.disabled === true || accountStatus === "suspended";

        const sessionLastSeenMs = latestSession?.last_seen
            ? new Date(latestSession.last_seen).getTime()
            : Number.NaN;

        const isSessionLive =
            latestSession != null &&
            latestSession.ended_at == null &&
            Number.isFinite(sessionLastSeenMs) &&
            now - sessionLastSeenMs >= -5000 &&
            now - sessionLastSeenMs <= PRESENCE_WINDOW_MS;

        const online =
            !isDisabled && (presence?.is_online === true || isSessionLive);

        const onlineAt =
            latestSession?.started_at ??
            activity?.last_login_at ??
            user.last_seen ??
            user.created_at ??
            null;

        const offlineAt = online
            ? null
            : latestSession?.ended_at ??
              latestSession?.last_seen ??
              presence?.last_seen ??
              activity?.updated_at ??
              user.last_seen ??
              null;

        const lastSeen =
            presence?.last_seen ??
            latestSession?.last_seen ??
            activity?.last_login_at ??
            user.last_seen ??
            null;

        const bookCount = authorInfo?.bookCount ?? 0;

        libraryUsers.push({
            id: user.id,
            displayName:
                user.display_name?.trim() ||
                authorInfo?.authorName?.trim() ||
                "Unnamed User",
            email: user.email ?? "",
            lastSeen,
            onlineAt,
            offlineAt,
            lastLoginAt: activity?.last_login_at ?? onlineAt,
            phoneNumber: user.phone_number,
            emailVerified: user.email_verified === true,
            disabled: isDisabled,
            accountStatus,
            product: "library",
            role: user.default_role || (authorInfo ? "author" : "user"),
            defaultRole: user.default_role || (authorInfo ? "author" : "user"),
            bookCount,
            projectCount: bookCount,
            sessionCount: userLibSessions.length,
            isAuthorProfile: Boolean(authorInfo),
            authorName: authorInfo?.authorName ?? null,
            online,
        });
    }

    // Sort: Online users first, then by most recent onlineAt
    libraryUsers.sort((a, b) => {
        if (a.online !== b.online) return a.online ? -1 : 1;
        const timeA = a.onlineAt ? new Date(a.onlineAt).getTime() : 0;
        const timeB = b.onlineAt ? new Date(b.onlineAt).getTime() : 0;
        return timeB - timeA;
    });

    const activeUsers = libraryUsers.filter(
        (u) => u.accountStatus === "active" && !u.disabled,
    ).length;
    const suspendedUsers = libraryUsers.length - activeUsers;
    const onlineUsers = libraryUsers.filter((u) => u.online).length;
    const offlineUsers = libraryUsers.length - onlineUsers;
    const authorAccounts = libraryUsers.filter(
        (u) => u.role === "author" || u.isAuthorProfile,
    ).length;
    const readerAccounts = libraryUsers.filter(
        (u) => u.role !== "author" && !u.isAuthorProfile,
    ).length;

    return {
        users: libraryUsers,
        totalAccounts: libraryUsers.length,
        activeUsers,
        suspendedUsers,
        onlineUsers,
        offlineUsers,
        verifiedEmails: libraryUsers.filter((u) => u.emailVerified).length,
        authorAccounts,
        readerAccounts,
        isolatedStudioAccounts,
        totalPlatformAccounts: data.auth_users.length,
    };
}

export async function getLibraryUserDetails(userId: string) {
    const result = await executeGraphQL<{
        auth_users_by_pk: {
            id: string;
            display_name: string | null;
            email: string | null;
            phone_number: string | null;
            email_verified: boolean | null;
            disabled: boolean | null;
            default_role: string | null;
            last_seen: string | null;
            created_at: string | null;
            updated_at: string | null;
            user_auth: {
                id: string;
                name: string;
                bio: string;
                book_num: number;
                followers_num: number | null;
            }[];
            user_reading_aggregate: { aggregate: { count: number } | null };
            user_fav_aggregate: { aggregate: { count: number } | null };
            UserReview_aggregate: { aggregate: { count: number } | null };
        } | null;
        auth_user_activity_by_pk: {
            user_id: string;
            last_login_at: string;
            last_login_product: string;
            account_status: string;
            created_at: string;
            updated_at: string;
        } | null;
        libaray_user_presence: {
            user_id: string;
            is_online: boolean;
            last_seen: string | null;
        }[];
        libaray_user_sessions: {
            id: string;
            user_id: string;
            started_at: string;
            last_seen: string;
            ended_at: string | null;
            user_agent: string | null;
            ip_address: string | null;
        }[];
        libaray_chapter_read_sessions: {
            id: string;
            chapter_id: string;
            started_at: string;
            last_heartbeat_at: string;
            ended_at: string;
            accumulated_sec: number;
        }[];
    }>(GET_LIBRARY_USER_DETAILS, { userId });

    const user = result.auth_users_by_pk;
    if (!user) return null;

    const activity = result.auth_user_activity_by_pk;
    const presence = result.libaray_user_presence[0] ?? null;
    const userSessions = result.libaray_user_sessions ?? [];
    const latestSession = userSessions[0] ?? null;

    const accountStatus: "active" | "suspended" =
        user.disabled || activity?.account_status === "suspended"
            ? "suspended"
            : "active";

    const isOnline =
        accountStatus === "active" &&
        !user.disabled &&
        Boolean(presence?.is_online);

    const onlineAt =
        latestSession?.started_at ??
        activity?.last_login_at ??
        user.last_seen ??
        user.created_at ??
        null;

    const offlineAt = isOnline
        ? null
        : latestSession?.ended_at ??
          latestSession?.last_seen ??
          presence?.last_seen ??
          activity?.updated_at ??
          user.last_seen ??
          null;

    const totalBooks = (user.user_auth ?? []).reduce(
        (sum, a) => sum + (a.book_num ?? 0),
        0,
    );

    return {
        user: {
            id: user.id,
            name:
                user.display_name ||
                user.user_auth?.[0]?.name ||
                user.email ||
                "Unknown User",
            email: user.email,
            phoneNumber: user.phone_number,
            emailVerified: user.email_verified === true,
            disabled: user.disabled === true || accountStatus === "suspended",
            role: user.default_role || "author",
            accountStatus,
            product: (activity?.last_login_product === "studio"
                ? "studio"
                : "library") as "studio" | "library",
            online: isOnline,
            onlineAt,
            offlineAt,
            lastSeen:
                presence?.last_seen ??
                latestSession?.last_seen ??
                user.last_seen ??
                null,
            bookCount: totalBooks,
            readingCount: user.user_reading_aggregate?.aggregate?.count ?? 0,
            favoritesCount: user.user_fav_aggregate?.aggregate?.count ?? 0,
            reviewsCount: user.UserReview_aggregate?.aggregate?.count ?? 0,
        },
        authorProfiles: user.user_auth ?? [],
        userSessions,
        chapterReadSessions: result.libaray_chapter_read_sessions ?? [],
    };
}

