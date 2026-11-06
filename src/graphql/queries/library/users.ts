export {
    GET_ALL_USERS_WITH_ACTIVITY,
    UPSERT_USER_ACTIVITY,
    UPDATE_USER_ACTIVITY_STATUS,
    TERMINATE_USER_ALL_SESSIONS,
} from "@/graphql/queries/studio/users";

export const GET_LIBRARY_USER_DETAILS = `
    query GetLibraryUserDetails($userId: uuid!) {
        auth_users_by_pk(id: $userId) {
            id
            display_name
            email
            phone_number
            email_verified
            disabled
            default_role
            last_seen
            created_at
            updated_at
            user_auth {
                id
                name
                bio
                book_num
                followers_num
            }
            user_reading_aggregate {
                aggregate {
                    count
                }
            }
            user_fav_aggregate {
                aggregate {
                    count
                }
            }
            UserReview_aggregate {
                aggregate {
                    count
                }
            }
        }
        auth_user_activity_by_pk(user_id: $userId) {
            user_id
            last_login_at
            last_login_product
            account_status
            created_at
            updated_at
        }
        libaray_user_presence(where: { user_id: { _eq: $userId } }) {
            user_id
            is_online
            last_seen
        }
        libaray_user_sessions(
            where: { user_id: { _eq: $userId } }
            order_by: { last_seen: desc }
            limit: 50
        ) {
            id
            user_id
            started_at
            last_seen
            ended_at
            user_agent
            ip_address
        }
        libaray_chapter_read_sessions(
            where: { user_id: { _eq: $userId } }
            order_by: { started_at: desc }
            limit: 50
        ) {
            id
            chapter_id
            started_at
            last_heartbeat_at
            ended_at
            accumulated_sec
        }
    }
`;

