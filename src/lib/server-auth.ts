import "server-only";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const TOKEN_COOKIE_NAME = "token";

interface HasuraClaims {
    "x-hasura-user-id": string;
    "x-hasura-default-role": string;
    "x-hasura-allowed-roles": string[];
}

interface AuthTokenPayload extends jwt.JwtPayload {
    "https://hasura.io/jwt/claims"?: HasuraClaims;
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
export async function getCurrentAuth() {
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

        if (
            !claims["x-hasura-user-id"] ||
            !claims["x-hasura-default-role"]
        ) {
            return null;
        }

        return {
            userId: claims["x-hasura-user-id"],
            role: claims["x-hasura-default-role"],
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