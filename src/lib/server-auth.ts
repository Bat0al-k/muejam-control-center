// import "server-only";

// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// const TOKEN_COOKIE_NAME = "token";

// interface HasuraClaims {
//     "x-hasura-user-id": string;
//     "x-hasura-default-role": string;
//     "x-hasura-allowed-roles": string[];
// }

// interface AuthTokenPayload extends jwt.JwtPayload {
//     "https://hasura.io/jwt/claims"?: HasuraClaims;
// }

// function getJwtSecret(): string {
//     const jwtSecretRaw =
//         process.env.HASURA_GRAPHQL_JWT_SECRET;

//     if (!jwtSecretRaw) {
//         throw new Error(
//             "HASURA_GRAPHQL_JWT_SECRET is not configured."
//         );
//     }

//     try {
//         const jwtSecret = JSON.parse(jwtSecretRaw);

//         if (!jwtSecret.key) {
//             throw new Error(
//                 "HASURA_GRAPHQL_JWT_SECRET key is missing."
//             );
//         }

//         return jwtSecret.key;
//     } catch {
//         throw new Error(
//             "HASURA_GRAPHQL_JWT_SECRET contains invalid JSON."
//         );
//     }
// }

// /**
//  * Get the currently authenticated user from the
//  * HttpOnly authentication cookie.
//  *
//  * This function must only run on the server.
//  */
// export async function getCurrentAuth() {
//     const cookieStore = await cookies();
//     const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

//     if (!token) {
//         return null;
//     }

//     try {
//         const jwtSecret = getJwtSecret();

//         const payload = jwt.verify(
//             token,
//             jwtSecret,
//             {
//                 algorithms: ["HS256"],
//             }
//         ) as AuthTokenPayload;

//         const claims =
//             payload["https://hasura.io/jwt/claims"];

//         if (!claims) {
//             return null;
//         }

//         if (
//             !claims["x-hasura-user-id"] ||
//             !claims["x-hasura-default-role"]
//         ) {
//             return null;
//         }

//         return {
//             userId: claims["x-hasura-user-id"],
//             role: claims["x-hasura-default-role"],
//             allowedRoles:
//                 claims["x-hasura-allowed-roles"] ?? [],
//         };
//     } catch {
//         /**
//          * jwt.verify() automatically rejects:
//          *
//          * - invalid signatures
//          * - expired tokens
//          * - malformed tokens
//          */
//         return null;
//     }
// }

import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import {
    ROLE_PERMISSIONS,
    type Permission,
} from "@/features/auth/permissions";
import {
    USER_ROLES,
    type UserRole,
} from "@/features/auth/roles";

const TOKEN_COOKIE_NAME = "token";

interface HasuraClaims {
    "x-hasura-user-id": string;
    "x-hasura-default-role": string;
    "x-hasura-allowed-roles": string[];
}

interface AuthTokenPayload extends jwt.JwtPayload {
    "https://hasura.io/jwt/claims"?: HasuraClaims;
}

interface CurrentAuth {
    userId: string;
    role: UserRole;
    allowedRoles: string[];
}

function getJwtSecret(): string {
    const jwtSecretRaw =
        process.env.HASURA_GRAPHQL_JWT_SECRET;

    if (!jwtSecretRaw) {
        throw new Error(
            "HASURA_GRAPHQL_JWT_SECRET is not configured."
        );
    }

    try {
        const jwtSecret = JSON.parse(jwtSecretRaw);

        if (!jwtSecret.key) {
            throw new Error(
                "HASURA_GRAPHQL_JWT_SECRET key is missing."
            );
        }

        return jwtSecret.key;
    } catch {
        throw new Error(
            "HASURA_GRAPHQL_JWT_SECRET contains invalid JSON."
        );
    }
}

/**
 * Get the currently authenticated user from the
 * HttpOnly authentication cookie.
 *
 * This function must only run on the server.
 */
export async function getCurrentAuth(): Promise<CurrentAuth | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) {
        return null;
    }

    try {
        const jwtSecret = getJwtSecret();

        const payload = jwt.verify(
            token,
            jwtSecret,
            {
                algorithms: ["HS256"],
            }
        ) as AuthTokenPayload;

        const claims =
            payload["https://hasura.io/jwt/claims"];

        if (!claims) {
            return null;
        }

        const userId = claims["x-hasura-user-id"];
        const role = claims["x-hasura-default-role"];

        if (!userId || !role) {
            return null;
        }

        if (
            role !== USER_ROLES.DEVELOPER &&
            role !== USER_ROLES.ADMIN &&
            role !== USER_ROLES.AUTHOR
        ) {
            return null;
        }

        return {
            userId,
            role,
            allowedRoles:
                claims["x-hasura-allowed-roles"] ?? [],
        };
    } catch {
        /**
         * jwt.verify() automatically rejects:
         *
         * - invalid signatures
         * - expired tokens
         * - malformed tokens
         */
        return null;
    }
}

/**
 * Require an authenticated user.
 *
 * Redirects unauthenticated users to the login page.
 */
export async function requireAuth(): Promise<CurrentAuth> {
    const auth = await getCurrentAuth();

    if (!auth) {
        redirect("/login");
    }

    return auth;
}

/**
 * Check whether the current role has a specific permission.
 */
export function hasPermission(
    role: UserRole,
    permission: Permission
): boolean {
    return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Require a specific permission.
 *
 * Redirects authenticated users who do not have
 * the required permission to an unauthorized page.
 */
export async function requirePermission(
    permission: Permission
): Promise<CurrentAuth> {
    const auth = await requireAuth();

    if (!hasPermission(auth.role, permission)) {
        redirect("/unauthorized");
    }

    return auth;
}

/**
 * Require one of the specified roles.
 */
export async function requireRole(
    ...roles: UserRole[]
): Promise<CurrentAuth> {
    const auth = await requireAuth();

    if (!roles.includes(auth.role)) {
        redirect("/unauthorized");
    }

    return auth;
}