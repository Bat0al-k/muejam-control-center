import "server-only";

import jwt from "jsonwebtoken";

export const RESET_TOKEN_COOKIE = "password_reset_token";

const RESET_TOKEN_DURATION = "10m";

interface PasswordResetPayload extends jwt.JwtPayload {
    sub: string;
    purpose: "password-reset";
}

function getResetSecret(): string {
    const secret = process.env.PASSWORD_RESET_SECRET;

    if (!secret) {
        throw new Error(
            "PASSWORD_RESET_SECRET is not configured."
        );
    }

    return secret;
}

export function createPasswordResetToken(
    userId: string
): string {
    return jwt.sign(
        {
            sub: userId,
            purpose: "password-reset",
        },
        getResetSecret(),
        {
            algorithm: "HS256",
            expiresIn: RESET_TOKEN_DURATION,
        }
    );
}

export function verifyPasswordResetToken(
    token: string
): PasswordResetPayload | null {
    try {
        const payload = jwt.verify(
            token,
            getResetSecret(),
            {
                algorithms: ["HS256"],
            }
        ) as PasswordResetPayload;

        if (
            payload.purpose !== "password-reset" ||
            !payload.sub
        ) {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}
