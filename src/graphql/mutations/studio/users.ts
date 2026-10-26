export const UPDATE_STUDIO_USER = `
    mutation UpdateStudioUser(
        $id: uuid!
        $displayName: String
        $email: citext
        $phoneNumber: String
        $emailVerified: Boolean
        $disabled: Boolean
        $defaultRole: String
    ) {
        update_auth_users_by_pk(
            pk_columns: { id: $id }
            _set: {
                display_name: $displayName
                email: $email
                phone_number: $phoneNumber
                email_verified: $emailVerified
                disabled: $disabled
                default_role: $defaultRole
            }
        ) {
            id
            display_name
            email
            phone_number
            email_verified
            disabled
            default_role
            last_seen
        }
    }
`;

export const DELETE_STUDIO_USER = `
    mutation DeleteStudioUser($id: uuid!) {
        delete_auth_users_by_pk(id: $id) {
            id
        }
    }
`;
