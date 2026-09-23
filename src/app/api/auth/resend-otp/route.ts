// import { NextRequest, NextResponse } from "next/server";
// import { executeGraphQL } from "@/graphql/client";
// import { generateAndSendOtp } from "@/features/auth/otp.service";

// const GET_PENDING_REGISTRATION = `
//     query GetPendingRegistrationForResend($email: citext!) {
//         auth_pending_registrations(
//             where: { email: { _eq: $email } }
//             limit: 1
//         ) {
//             id
//             email
//             email_verified
//             expires_at
//         }
//     }
// `;

// const UPDATE_OTP = `
//     mutation UpdatePendingRegistrationOtp(
//         $id: uuid!
//         $otpHash: String!
//         $otpExpiresAt: timestamptz!
//     ) {
//         update_auth_pending_registrations_by_pk(
//             pk_columns: { id: $id }
//             _set: {
//                 otp_hash: $otpHash
//                 otp_hash_expires_at: $otpExpiresAt
//             }
//         ) {
//             id
//             email
//             otp_hash
//             otp_hash_expires_at
//         }
//     }
// `;

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();

//         const email =
//             typeof body.email === "string"
//                 ? body.email.trim().toLowerCase()
//                 : "";

//         if (!email) {
//             return NextResponse.json(
//                 { message: "Email is required." },
//                 { status: 400 }
//             );
//         }

//         const data = await executeGraphQL<{
//             auth_pending_registrations: Array<{
//                 id: string;
//                 email: string;
//                 email_verified: boolean;
//                 expires_at: string;
//             }>;
//         }>(
//             GET_PENDING_REGISTRATION,
//             { email }
//         );

//         const pendingRegistration =
//             data.auth_pending_registrations[0];

//         if (!pendingRegistration) {
//             return NextResponse.json(
//                 {
//                     message:
//                         "Registration session not found.",
//                 },
//                 { status: 404 }
//             );
//         }

//         if (pendingRegistration.email_verified) {
//             return NextResponse.json(
//                 {
//                     message:
//                         "Email is already verified.",
//                 },
//                 { status: 400 }
//             );
//         }

//         const registrationExpiresAt =
//             new Date(
//                 pendingRegistration.expires_at
//             ).getTime();

//         if (
//             Number.isNaN(registrationExpiresAt) ||
//             Date.now() >= registrationExpiresAt
//         ) {
//             return NextResponse.json(
//                 {
//                     message:
//                         "This registration has expired. Please start again.",
//                 },
//                 { status: 400 }
//             );
//         }

//         await generateAndSendOtp(
//             pendingRegistration.email,
//             "registration",
//             async (otpHash, otpExpiresAt) => {
//                 await executeGraphQL(
//                     UPDATE_OTP,
//                     {
//                         id: pendingRegistration.id,
//                         otpHash,
//                         otpExpiresAt,
//                     }
//                 );
//             }
//         );

//         return NextResponse.json({
//             success: true,
//             message:
//                 "A new verification code has been sent.",
//         });
//     } catch (error) {
//         console.error(
//             "Resend OTP error:",
//             error
//         );

//         return NextResponse.json(
//             {
//                 message:
//                     "Unable to resend verification code. Please try again.",
//             },
//             { status: 500 }
//         );
//     }
// }
import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/graphql/client";
import { generateAndSendOtp } from "@/features/auth/otp.service";

type OtpContext = "registration" | "password-reset";

const GET_PENDING_REGISTRATION = `
    query GetPendingRegistrationForResend($email: citext!) {
        auth_pending_registrations(
            where: { email: { _eq: $email } }
            limit: 1
        ) {
            id
            email
            email_verified
            expires_at
        }
    }
`;

const UPDATE_REGISTRATION_OTP = `
    mutation UpdatePendingRegistrationOtp(
        $id: uuid!
        $otpHash: String!
        $otpExpiresAt: timestamptz!
    ) {
        update_auth_pending_registrations_by_pk(
            pk_columns: { id: $id }
            _set: {
                otp_hash: $otpHash
                otp_hash_expires_at: $otpExpiresAt
            }
        ) {
            id
            email
        }
    }
`;

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

interface PendingRegistration {
    id: string;
    email: string;
    email_verified: boolean;
    expires_at: string;
}

interface GetPendingRegistrationResponse {
    auth_pending_registrations: PendingRegistration[];
}

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const context = body.context as OtpContext;

        if (!email) {
            return NextResponse.json(
                { message: "Email is required." },
                { status: 400 }
            );
        }

        if (
            context !== "registration" &&
            context !== "password-reset"
        ) {
            return NextResponse.json(
                { message: "Invalid OTP context." },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // Registration
        // -----------------------------------------
        if (context === "registration") {
            const data =
                await executeGraphQL<GetPendingRegistrationResponse>(
                    GET_PENDING_REGISTRATION,
                    { email }
                );

            const pendingRegistration =
                data.auth_pending_registrations[0];

            if (!pendingRegistration) {
                return NextResponse.json(
                    {
                        message:
                            "Registration session not found.",
                    },
                    { status: 404 }
                );
            }

            if (pendingRegistration.email_verified) {
                return NextResponse.json(
                    {
                        message:
                            "Email is already verified.",
                    },
                    { status: 400 }
                );
            }

            const registrationExpiresAt =
                new Date(
                    pendingRegistration.expires_at
                ).getTime();

            if (
                Number.isNaN(registrationExpiresAt) ||
                Date.now() >= registrationExpiresAt
            ) {
                return NextResponse.json(
                    {
                        message:
                            "This registration has expired. Please start again.",
                    },
                    { status: 400 }
                );
            }

            await generateAndSendOtp(
                pendingRegistration.email,
                "registration",
                async (otpHash, otpExpiresAt) => {
                    await executeGraphQL(
                        UPDATE_REGISTRATION_OTP,
                        {
                            id: pendingRegistration.id,
                            otpHash,
                            otpExpiresAt,
                        }
                    );
                }
            );

            return NextResponse.json({
                success: true,
                message:
                    "A new verification code has been sent.",
            });
        }

        // -----------------------------------------
        // Password Reset
        // -----------------------------------------
        const data =
            await executeGraphQL<GetUserResponse>(
                GET_USER_BY_EMAIL,
                { email }
            );

        const user = data.auth_users[0];

        /**
         * Don't reveal whether an email is registered.
         */
        if (
            !user ||
            user.disabled ||
            !user.password_hash
        ) {
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
                await executeGraphQL(
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
            "Resend OTP error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Unable to resend verification code. Please try again.",
            },
            { status: 500 }
        );
    }
}