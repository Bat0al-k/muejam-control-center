import "server-only";
import { executeGraphQL } from "@/graphql/client";
import {
    GET_AUTH_USER_BY_EMAIL_FOR_REGISTER,
    GET_PENDING_REGISTRATION_BY_EMAIL,
    INSERT_PENDING_REGISTRATION,
    UPDATE_PENDING_REGISTRATION_OTP,
} from "@/graphql/queries/auth/register";
import { generateAndSendOtp } from "./otp.service";

const REGISTRATION_EXPIRATION_MINUTES = 30;

interface ExistingUser {
    id: string;
    email: string;
    email_verified: boolean;
    disabled: boolean;
    password_hash: string | null;
}

interface GetUserResponse {
    auth_users: ExistingUser[];
}

interface PendingRegistration {
    id: string;
    email: string;
    email_verified: boolean;
    username: string | null;
    password_hash: string | null;
    otp_hash: string | null;
    otp_hash_expires_at: string | null;
    expires_at: string;
}

interface GetPendingRegistrationResponse {
    auth_pending_registrations: PendingRegistration[];
}

interface InsertPendingRegistrationResponse {
    insert_auth_pending_registrations_one: {
        id: string;
        email: string;
        email_verified: boolean;
    };
}

interface UpdatePendingOtpResponse {
    update_auth_pending_registrations_by_pk: {
        id: string;
        email: string;
        otp_hash: string;
        otp_hash_expires_at: string;
    };
}

interface CompleteRegistrationResponse {
    insert_auth_users_one: {
        id: string;
        email: string;
        display_name: string | null;
        email_verified: boolean;
        default_role: string | null;
        disabled: boolean;
    };

    delete_auth_pending_registrations_by_pk: {
        id: string;
    };
}

export interface RegisterResult {
    id: string;
    email: string;
    requiresVerification: boolean;
}



export async function registerUser(
    email: string
): Promise<RegisterResult> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
        throw new Error("Email is required.");
    }

    /*
     * Check completed/real accounts only.
     *
     * We still query auth_users here to prevent
     * an existing account from starting registration again.
     *
     * We DO NOT create or update auth_users.
     */
    const existingData =
        await executeGraphQL<GetUserResponse>(
            GET_AUTH_USER_BY_EMAIL_FOR_REGISTER,
            {
                email: normalizedEmail,
            }
        );

    const existingUser = existingData.auth_users[0];

    /*
     * Existing completed account
     */
    if (
        existingUser &&
        existingUser.email_verified &&
        existingUser.password_hash
    ) {
        throw new Error(
            "This email is already registered. Please login."
        );
    }

    /*
     * Existing disabled account
     */
    if (existingUser?.disabled) {
        throw new Error("This account is disabled.");
    }

    const registrationExpiresAt = new Date(
        Date.now() +
        REGISTRATION_EXPIRATION_MINUTES * 60 * 1000
    ).toISOString();

    /*
     * Check whether this email already has
     * a pending registration.
     */
    const pendingData =
        await executeGraphQL<GetPendingRegistrationResponse>(
            GET_PENDING_REGISTRATION_BY_EMAIL,
            {
                email: normalizedEmail,
            }
        );

    const pendingRegistration =
        pendingData.auth_pending_registrations[0];

    /*
     * Existing pending registration:
     * refresh its OTP and registration expiration.
     */
    if (pendingRegistration) {
        await generateAndSendOtp(
            pendingRegistration.email,
            "registration",
            async (otpHash, otpExpiresAt) => {
                await executeGraphQL<UpdatePendingOtpResponse>(
                    UPDATE_PENDING_REGISTRATION_OTP,
                    {
                        id: pendingRegistration.id,
                        otpHash,
                        otpExpiresAt,
                        registrationExpiresAt,
                    }
                );
            }
        );

        return {
            id: pendingRegistration.id,
            email: pendingRegistration.email,
            requiresVerification: true,
        };
    }

    /*
     * New pending registration.
     *
     * IMPORTANT:
     * No auth_users row is created here.
     */
    let insertedId = "";
    let insertedEmail = "";

    await generateAndSendOtp(
        normalizedEmail,
        "registration",
        async (otpHash, otpExpiresAt) => {
            const data =
                await executeGraphQL<InsertPendingRegistrationResponse>(
                    INSERT_PENDING_REGISTRATION,
                    {
                        object: {
                            email: normalizedEmail,
                            email_verified: false,
                            otp_hash: otpHash,
                            otp_hash_expires_at: otpExpiresAt,
                            expires_at: registrationExpiresAt,
                        },
                    }
                );

            const pending =
                data.insert_auth_pending_registrations_one;

            insertedId = pending.id;
            insertedEmail = pending.email;
        }
    );

    return {
        id: insertedId,
        email: insertedEmail,
        requiresVerification: true,
    };
}

/*
 * FINAL REGISTRATION STEP
 *
 * Creates the real auth_users account from the
 * completed pending registration, then removes
 * the pending registration.
 */
export async function completeRegistration(
    email: string
): Promise<{
    id: string;
    email: string;
}> {
    const normalizedEmail =
        email.trim().toLowerCase();

    if (!normalizedEmail) {
        throw new Error("Email is required.");
    }

    /*
     * Get the pending registration.
     */
    const data =
        await executeGraphQL<GetPendingRegistrationResponse>(
            GET_PENDING_REGISTRATION_BY_EMAIL,
            {
                email: normalizedEmail,
            }
        );

    const pendingRegistration =
        data.auth_pending_registrations[0];

    if (!pendingRegistration) {
        throw new Error(
            "Registration session not found."
        );
    }

    /*
     * Make sure the registration has not expired.
     */
    const expiresAt =
        new Date(
            pendingRegistration.expires_at
        ).getTime();

    if (
        Number.isNaN(expiresAt) ||
        Date.now() >= expiresAt
    ) {
        throw new Error(
            "This registration has expired. Please start again."
        );
    }

    /*
     * Email must be verified.
     */
    if (!pendingRegistration.email_verified) {
        throw new Error(
            "Please verify your email before completing registration."
        );
    }

    /*
     * Username is required.
     */
    if (!pendingRegistration.username) {
        throw new Error(
            "Username is missing."
        );
    }

    /*
     * Password hash must already exist.
     */
    if (!pendingRegistration.password_hash) {
        throw new Error(
            "Password has not been set."
        );
    }

    /*
     * Create the real account and delete the
     * temporary registration in the same
     * GraphQL mutation request.
     */
    const COMPLETE_REGISTRATION = `
        mutation CompleteRegistration(
            $user: auth_users_insert_input!
            $pendingId: uuid!
        ) {
            insert_auth_users_one(
                object: $user
            ) {
                id
                email
                display_name
                email_verified
                default_role
                disabled
            }

            delete_auth_pending_registrations_by_pk(
                id: $pendingId
            ) {
                id
            }
        }
    `;

    const result =
        await executeGraphQL<CompleteRegistrationResponse>(
            COMPLETE_REGISTRATION,
            {
                user: {
                    email: pendingRegistration.email,
                    display_name: pendingRegistration.username,
                    password_hash:
                        pendingRegistration.password_hash,
                    email_verified: true,
                    default_role: "author",
                    disabled: false,
                    locale: "en"
                },
                pendingId:
                    pendingRegistration.id,
            }
        );

    return {
        id:
            result.insert_auth_users_one.id,
        email:
            result.insert_auth_users_one.email,
    };
}
