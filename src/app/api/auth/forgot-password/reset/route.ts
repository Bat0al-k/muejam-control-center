import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { executeGraphQL } from "@/graphql/client";
import {
    RESET_TOKEN_COOKIE,
    verifyPasswordResetToken,
} from "@/lib/password-reset";

const UPDATE_PASSWORD = `
    mutation UpdatePassword(
        $id: uuid!
        $passwordHash: String!
    ) {
        update_auth_users_by_pk(
            pk_columns: { id: $id }
            _set: {
                password_hash: $passwordHash
            }
        ) {
            id
        }
    }
`;

export async function POST(request: NextRequest) {
    try {
        // 1. Read the new password
        const body = await request.json();

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

        const confirmPassword =
            typeof body.confirmPassword === "string"
                ? body.confirmPassword
                : "";

        // 2. Basic validation
        if (!password || !confirmPassword) {
            return NextResponse.json(
                {
                    message:
                        "Password and confirmation are required.",
                },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                {
                    message: "Passwords do not match.",
                },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                {
                    message:
                        "Password must be at least 8 characters.",
                },
                { status: 400 }
            );
        }

        if (!/[A-Z]/.test(password)) {
            return NextResponse.json(
                {
                    message:
                        "Password must contain an uppercase letter.",
                },
                { status: 400 }
            );
        }

        if (!/[0-9]/.test(password)) {
            return NextResponse.json(
                {
                    message:
                        "Password must contain a number.",
                },
                { status: 400 }
            );
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            return NextResponse.json(
                {
                    message:
                        "Password must contain a special character.",
                },
                { status: 400 }
            );
        }

        // 3. Read the reset token from the HttpOnly cookie
        const cookieStore = await cookies();

        const resetToken =
            cookieStore.get(RESET_TOKEN_COOKIE)?.value;

        if (!resetToken) {
            return NextResponse.json(
                {
                    message:
                        "Password reset session is missing or expired.",
                },
                { status: 401 }
            );
        }

        // 4. Verify the reset token
        const resetSession =
            verifyPasswordResetToken(resetToken);

        if (!resetSession) {
            return NextResponse.json(
                {
                    message:
                        "Password reset session is invalid or expired.",
                },
                { status: 401 }
            );
        }

        // 5. Get the user ID from the verified token
        const userId = resetSession.sub;

        // 6. Hash the new password
        const passwordHash = await bcrypt.hash(
            password,
            12
        );

        // 7. Update the password for THIS user only
        await executeGraphQL(
            UPDATE_PASSWORD,
            {
                id: userId,
                passwordHash,
            }
        );

        // 8. Remove the reset token
        const response = NextResponse.json({
            success: true,
            message: "Password reset successfully.",
        });

        response.cookies.set({
            name: RESET_TOKEN_COOKIE,
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;
    } catch (error) {
        console.error(
            "Password reset error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Unable to reset password. Please try again.",
            },
            { status: 500 }
        );
    }
}