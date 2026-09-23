// sendVerificationCode(email)
// verifyRegistrationCode(email, code)
// createPassword(email, password)

// login(email, password)

// sendForgotPasswordCode(email)
// verifyForgotPasswordCode(email, code)
// resetPassword(email, code, newPassword)


import "server-only";

import bcrypt from "bcryptjs";
import { executeGraphQL } from "@/graphql/client";
import { GET_AUTH_USER_BY_EMAIL } from "@/graphql/queries/auth/users";
import type { AuthUser } from "./auth.types";

interface AuthUserFromDatabase {
    id: string;
    display_name: string | null;
    email: string;
    email_verified: boolean;
    last_seen: string | null;
    disabled: boolean;
    default_role: string | null;
    password_hash: string | null;
    role: {
        role: string;
    } | null;
}

interface GetAuthUserResponse {
    auth_users: AuthUserFromDatabase[];
}

/**
 * Get an authentication user by email.
 *
 * This function is SERVER-ONLY because it reads password_hash
 * from the database.
 */
async function getAuthUserByEmail(
    email: string
): Promise<AuthUserFromDatabase | null> {
    const data = await executeGraphQL<GetAuthUserResponse>(
        GET_AUTH_USER_BY_EMAIL,
        {
            email,
        }
    );

    return data.auth_users[0] ?? null;
}

/**
 * Authenticate a user using email + password.
 */
export async function authenticateUser(
    email: string,
    password: string
): Promise<AuthUser> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
        throw new Error("Email and password are required.");
    }

    const user = await getAuthUserByEmail(normalizedEmail);

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    if (user.disabled) {
        throw new Error("This account is disabled.");
    }

    if (!user.password_hash) {
        throw new Error("This account does not have a password yet.");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        throw new Error("Invalid email or password.");
    }

    /**
     * Prefer the role relation because this is the actual role
     * relation exposed by the auth schema.
     *
     * default_role is kept as a fallback.
     */
    const role =
        user.role?.role ||
        user.default_role ||
        "author";

    return {
        id: user.id,
        displayName: user.display_name,
        email: user.email,
        emailVerified: user.email_verified,
        lastSeen: user.last_seen,
        disabled: user.disabled,
        role: role as AuthUser["role"],
    };
}