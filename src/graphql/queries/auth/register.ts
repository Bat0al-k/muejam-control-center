

export const GET_AUTH_USER_BY_EMAIL_FOR_REGISTER = `
query GetAuthUserByEmailForRegister($email: citext!) {
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

// export const INSERT_AUTH_USER = `    
//     mutation InsertAuthUser($object: auth_users_insert_input!) {
//         insert_auth_users_one(object: $object) {
//             id
//             email
//             email_verified
//             default_role
//         }
//     }`;

export const GET_PENDING_REGISTRATION_BY_EMAIL = `
    query GetPendingRegistrationByEmail($email: citext!) {
        auth_pending_registrations(
            where: { email: { _eq: $email } }
            limit: 1
        ) {
            id
            email
            email_verified
            username
            password_hash
            otp_hash
            otp_hash_expires_at
            expires_at
        }
    }
`;

export const INSERT_PENDING_REGISTRATION = `
    mutation InsertPendingRegistration(
        $object: auth_pending_registrations_insert_input!
    ) {
        insert_auth_pending_registrations_one(
            object: $object
        ) {
            id
            email
            email_verified
        }
    }
`;

export const UPDATE_PENDING_REGISTRATION_OTP = `
    mutation UpdatePendingRegistrationOtp(
        $id: uuid!
        $otpHash: String!
        $otpExpiresAt: timestamptz!
        $registrationExpiresAt: timestamptz!
    ) {
        update_auth_pending_registrations_by_pk(
            pk_columns: { id: $id }
            _set: {
                otp_hash: $otpHash
                otp_hash_expires_at: $otpExpiresAt
                expires_at: $registrationExpiresAt
                updated_at: "now()"
            }
        ) {
            id
            email
            otp_hash
            otp_hash_expires_at
        }
    }
`;
