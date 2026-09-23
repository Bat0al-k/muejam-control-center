import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/graphql/client";
import { generateAndSendOtp } from "@/features/auth/otp.service";

const GET_USER_BY_EMAIL = `
    query GetUserForPasswordReset($email: citext!) {
        auth_users(
            where: { email: { _eq: $email } }
            limit: 1
        ) {
            id
            email
            email_verified
            disabled
            password_hash
        }
    }
`;

const UPDATE_RESET_OTP = `
    mutation UpdatePasswordResetOtp(
        $id: uuid!
        $otp: String!
        $expiresAt: timestamptz!
    ) {
        update_auth_users_by_pk(
            pk_columns: { id: $id }
            _set: {
                otp_hash: $otp
                otp_hash_expires_at: $expiresAt
            }
        ) {
            id
            email
        }
    }
`;

interface User {
    id: string;
    email: string;
    email_verified: boolean;
    disabled: boolean;
    password_hash: string | null;
}

interface GetUserResponse {
    auth_users: User[];
}

interface UpdateOtpResponse {
    update_auth_users_by_pk: {
        id: string;
        email: string;
    };
}



export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        if (!email) {
            return NextResponse.json(
                {
                    message:
                        "If the account exists, a verification code has been sent.",
                },
                { status: 200 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    message:
                        "If the account exists, a verification code has been sent.",
                },
                { status: 200 }
            );
        }

        const data =
            await executeGraphQL<GetUserResponse>(
                GET_USER_BY_EMAIL,
                { email }
            );

        const user = data.auth_users[0];

        /**
         * Don't reveal whether an email is registered.
         */
        if (!user || user.disabled || !user.password_hash) {
            return NextResponse.json({
                success: true,
                message:
                    "If the account exists, a verification code has been sent.",
            });
        }

        await generateAndSendOtp(
            user.email,
            "password-reset",
            async (otpHash, otpExpiresAt) => {
                await executeGraphQL<UpdateOtpResponse>(
                    UPDATE_RESET_OTP,
                    {
                        id: user.id,
                        otp: otpHash,
                        expiresAt: otpExpiresAt,
                    }
                );
            }
        );

        return NextResponse.json({
            success: true,
            message:
                "If the account exists, a verification code has been sent.",
        });
    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Unable to process your request. Please try again.",
            },
            { status: 500 }
        );
    }
}