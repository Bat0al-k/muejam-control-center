import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { executeGraphQL } from "@/graphql/client";
import {
    createPasswordResetToken,
    RESET_TOKEN_COOKIE,
} from "@/lib/password-reset";


const GET_USER_BY_EMAIL = `
    query GetUserForPasswordResetVerification($email: citext!) {
        auth_users(
            where: { email: { _eq: $email } }
            limit: 1
        ) {
            id
            email
            email_verified
            disabled
            otp_hash
            otp_hash_expires_at
        }
    }
`;

const CLEAR_OTP = `
    mutation ClearPasswordResetOtp($id: uuid!, $otpHash: String!, $expiresAt: timestamptz!) {
        update_auth_users_by_pk(
            pk_columns: { id: $id }
            _set: {
                otp_hash: $otpHash
                otp_hash_expires_at: $expiresAt
            }
        ) {
            id
            otp_hash
            otp_hash_expires_at
        }
    }
`;

interface User {
    id: string;
    email: string;
    email_verified: boolean;
    disabled: boolean;
    otp_hash: string | null;
    otp_hash_expires_at: string | null;
}

interface GetUserResponse {
    auth_users: User[];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const otp =
            typeof body.otp === "string"
                ? body.otp.trim()
                : "";

        if (!email || !/^\d{6}$/.test(otp)) {
            return NextResponse.json(
                {
                    message: "Invalid verification code.",
                },
                { status: 400 }
            );
        }

        const data =
            await executeGraphQL<GetUserResponse>(
                GET_USER_BY_EMAIL,
                { email }
            );

        const user = data.auth_users[0];

        if (!user || user.disabled) {
            return NextResponse.json(
                {
                    message: "Invalid verification code.",
                },
                { status: 400 }
            );
        }

        if (!user.otp_hash || !user.otp_hash_expires_at) {
            return NextResponse.json(
                {
                    message: "Invalid or expired verification code.",
                },
                { status: 400 }
            );
        }

        const expiresAt =
            new Date(user.otp_hash_expires_at).getTime();

        if (
            Number.isNaN(expiresAt) ||
            Date.now() >= expiresAt
        ) {
            return NextResponse.json(
                {
                    message: "Verification code has expired.",
                },
                { status: 400 }
            );
        }

        const otpMatches = await bcrypt.compare(otp, user.otp_hash);

        if (!otpMatches) {
            return NextResponse.json(
                {
                    message: "Invalid verification code.",
                },
                { status: 400 }
            );
        }

        /**
         * OTP is single-use.
         *
         * Clear it before issuing the reset token.
         */
        await executeGraphQL(
            CLEAR_OTP,
            {
                id: user.id,
                otpHash: user.otp_hash,
                expiresAt: user.otp_hash_expires_at,
            }
        );

        const resetToken = createPasswordResetToken(user.id);

        const response = NextResponse.json({
            success: true,
        });

        response.cookies.set({
            name: RESET_TOKEN_COOKIE,
            value: resetToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 10 * 60,
        });

        return response;

    } catch (error) {
        console.error(
            "Forgot password OTP verification error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Unable to verify the code. Please try again.",
            },
            { status: 500 }
        );
    }
}
