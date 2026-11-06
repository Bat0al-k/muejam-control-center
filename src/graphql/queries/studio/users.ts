export const GET_ALL_USERS_WITH_ACTIVITY = `
    query GetAllUsersWithActivity {
        auth_users(order_by: { created_at: desc }) {
            id
            display_name
            email
            last_seen
            phone_number
            email_verified
            disabled
            default_role
            created_at
            updated_at
        }
        auth_user_activity {
            user_id
            last_login_at
            last_login_product
            account_status
            created_at
            updated_at
        }
        Voice_Studio_user_presence {
            user_id
            is_online
            last_seen
        }
        Voice_Studio_user_sessions(order_by: { last_seen: desc }) {
            id
            user_id
            started_at
            last_seen
            ended_at
            user_agent
            ip_address
        }
        Voice_Studio_projects {
            id
            user_id
        }
        libaray_user_presence {
            user_id
            is_online
            last_seen
        }
        libaray_user_sessions(order_by: { last_seen: desc }) {
            id
            user_id
            started_at
            last_seen
            ended_at
            user_agent
            ip_address
        }
        libaray_Autor {
            id
            user_id
            name
            book_num
        }
    }
`;

export const UPSERT_USER_ACTIVITY = `
    mutation UpsertUserActivity(
        $userId: uuid!
        $product: String!
        $accountStatus: String!
        $now: timestamptz!
    ) {
        insert_auth_user_activity_one(
            object: {
                user_id: $userId
                last_login_product: $product
                account_status: $accountStatus
                last_login_at: $now
                updated_at: $now
            }
            on_conflict: {
                constraint: user_activity_pkey
                update_columns: [last_login_product, account_status, last_login_at, updated_at]
            }
        ) {
            user_id
            last_login_product
            account_status
            last_login_at
            updated_at
        }
    }
`;

export const UPDATE_USER_ACTIVITY_STATUS = `
    mutation UpdateUserActivityStatus(
        $userId: uuid!
        $accountStatus: String!
        $now: timestamptz!
    ) {
        update_auth_user_activity_by_pk(
            pk_columns: { user_id: $userId }
            _set: {
                account_status: $accountStatus
                updated_at: $now
            }
        ) {
            user_id
            account_status
            updated_at
        }
    }
`;

export const TERMINATE_USER_ALL_SESSIONS = `
    mutation TerminateUserAllSessions($userId: uuid!, $now: timestamptz!) {
        update_Voice_Studio_user_sessions(
            where: { user_id: { _eq: $userId }, ended_at: { _is_null: true } }
            _set: { ended_at: $now }
        ) {
            affected_rows
        }
        update_libaray_user_sessions(
            where: { user_id: { _eq: $userId }, ended_at: { _is_null: true } }
            _set: { ended_at: $now }
        ) {
            affected_rows
        }
    }
`;

