// import { NextRequest, NextResponse } from "next/server";
// import { executeGraphQL } from "@/graphql/client";
// import bcrypt from "bcryptjs";

// interface UserOtpData {
//     id: string;
//     email: string;
//     email_verified: boolean;
//     otp_hash: string | null;
//     otp_hash_expires_at: string | null;
// }

// interface GetUserResponse {
//     auth_users: UserOtpData[];
// }

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const email =
//             typeof body.email === "string"
//                 ? body.email.trim().toLowerCase()
//                 : "";

//         const otp =
//             typeof body.otp === "string"
//                 ? body.otp.trim()
//                 : "";

//         if (!email || !otp) {
//             return NextResponse.json(
//                 {
//                     message: "Email and verification code are required.",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (!/^\d{6}$/.test(otp)) {
//             return NextResponse.json(
//                 {
//                     message: "Verification code must be 6 digits.",
//                 },
//                 { status: 400 }
//             );
//         }

//         const data =
//             await executeGraphQL<GetUserResponse>(
//                 `
//             query GetUserForVerification(
//                 $email: citext!
//             ) {
//                 auth_users(
//                     where: { email: { _eq: $email } }
//                     limit: 1
//                 ) {
//                     id
//                     email
//                     email_verified
//                     otp_hash
//                     otp_hash_expires_at
//                 }
//             }
//             `,
//                 { email }
//             );

//         const user = data.auth_users[0];

//         if (!user) {
//             return NextResponse.json(
//                 {
//                     message: "Account not found.",
//                 },
//                 { status: 404 }
//             );
//         }

//         if (user.email_verified) {
//             return NextResponse.json({
//                 success: true,
//                 message: "Email is already verified.",
//             });
//         }

//         if (!user.otp_hash || !user.otp_hash_expires_at) {
//             return NextResponse.json(
//                 {
//                     message:
//                         "No verification code found. Please request a new code.",
//                 },
//                 { status: 400 }
//             );
//         }

//         const expiresAt = new Date(
//             user.otp_hash_expires_at
//         ).getTime();

//         if (Date.now() > expiresAt) {
//             return NextResponse.json(
//                 {
//                     message:
//                         "This verification code has expired.",
//                 },
//                 { status: 400 }
//             );
//         }

//         if (!user.otp_hash) {
//             return NextResponse.json(
//                 {
//                     message: "Invalid verification code.",
//                 },
//                 { status: 400 }
//             );
//         }

//         const otpMatches = await bcrypt.compare(
//             otp,
//             user.otp_hash
//         );

//         if (!otpMatches) {
//             return NextResponse.json(
//                 {
//                     message: "Invalid verification code.",
//                 },
//                 { status: 400 }
//             );
//         }

//         await executeGraphQL(
//             `
//         mutation VerifyAuthUser(
//             $id: uuid!
//         ) {
//             update_auth_users_by_pk(
//                 pk_columns: { id: $id }
//                 _set: {
//                     email_verified: true
//                 }
//             ) {
//                 id
//                 email_verified
//             }
//         }
//         `,
//             {
//                 id: user.id,
//             }
//         );

//         return NextResponse.json({
//             success: true,
//             message: "Email verified successfully.",
//         });
//     } catch (error) {
//         console.error("Verification error:", error);

//         return NextResponse.json(
//             {
//                 message:
//                     "Unable to verify your email. Please try again.",
//             },
//             { status: 500 }
//         );
//     }
// }

import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/graphql/client";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

interface PendingRegistration {
    id: string;
    email: string;
    email_verified: boolean;
    otp_hash: string | null;
    otp_hash_expires_at: string | null;
    expires_at: string;
}

interface GetPendingRegistrationResponse {
    auth_pending_registrations: PendingRegistration[];
}

const GET_PENDING_REGISTRATION = `
    query GetPendingRegistrationForVerification(
        $email: citext!
    ) {
        auth_pending_registrations(
            where: { email: { _eq: $email } }
            limit: 1
        ) {
            id
            email
            email_verified
            otp_hash
            otp_hash_expires_at
            expires_at
        }
    }
`;

const VERIFY_PENDING_REGISTRATION = `
    mutation VerifyPendingRegistration(
        $id: uuid!
        $otpHash: String!
        $expiresAt: timestamptz!
    ) {
        update_auth_pending_registrations_by_pk(
            pk_columns: { id: $id }
            _set: {
                email_verified: true
                otp_hash: $otpHash
                otp_hash_expires_at: $expiresAt
            }
        ) {
            id
            email
            email_verified
            otp_hash
            otp_hash_expires_at
        }
    }
`;

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

        if (!email || !otp) {
            return NextResponse.json(
                {
                    message:
                        "Email and verification code are required.",
                },
                { status: 400 }
            );
        }

        if (!/^\d{6}$/.test(otp)) {
            return NextResponse.json(
                {
                    message:
                        "Verification code must be 6 digits.",
                },
                { status: 400 }
            );
        }

        /*
         * Get the pending registration.
         *
         * IMPORTANT:
         * We are NOT querying auth_users here.
         */
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
                        "Registration not found. Please start again.",
                },
                { status: 404 }
            );
        }

        /*
         * Registration itself has expired.
         */
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

        /*
         * Email is already verified.
         */
        if (pendingRegistration.email_verified) {
            return NextResponse.json({
                success: true,
                message: "Email is already verified.",
            });
        }

        /*
         * No OTP exists.
         */
        if (
            !pendingRegistration.otp_hash ||
            !pendingRegistration.otp_hash_expires_at
        ) {
            return NextResponse.json(
                {
                    message:
                        "No verification code found. Please request a new code.",
                },
                { status: 400 }
            );
        }

        /*
         * Check OTP expiration.
         */
        const otpExpiresAt =
            new Date(
                pendingRegistration.otp_hash_expires_at
            ).getTime();

        if (
            Number.isNaN(otpExpiresAt) ||
            Date.now() >= otpExpiresAt
        ) {
            return NextResponse.json(
                {
                    message:
                        "This verification code has expired.",
                },
                { status: 400 }
            );
        }

        /*
         * Compare the entered OTP
         * against the bcrypt hash stored in DB.
         */
        const otpMatches =
            await bcrypt.compare(
                otp,
                pendingRegistration.otp_hash
            );

        if (!otpMatches) {
            return NextResponse.json(
                {
                    message:
                        "Invalid verification code.",
                },
                { status: 400 }
            );
        }

        /*
         * OTP was correct.
         *
         * We keep actual values in the OTP fields,
         * but make the stored hash unusable and
         * expire it immediately.
         */
        const invalidOtpHash =
            await bcrypt.hash(
                randomUUID(),
                10
            );

        const expiredOtpAt =
            new Date(
                Date.now() - 1000
            ).toISOString();

        await executeGraphQL(
            VERIFY_PENDING_REGISTRATION,
            {
                id: pendingRegistration.id,
                otpHash: invalidOtpHash,
                expiresAt: expiredOtpAt,
            }
        );

        return NextResponse.json({
            success: true,
            message:
                "Email verified successfully.",
        });
    } catch (error) {
        console.error(
            "Verification error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Unable to verify your email. Please try again.",
            },
            { status: 500 }
        );
    }
}