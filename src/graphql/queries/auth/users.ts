
export const GET_AUTH_USER_BY_EMAIL = `
    query GetAuthUserByEmail($email: citext!) {
        auth_users(where: { email: { _eq: $email } }, limit: 1) {
            id
            display_name
            email
            email_verified
            last_seen
            disabled
            default_role
            password_hash
            role {
                role
            }
        }
    }
`;