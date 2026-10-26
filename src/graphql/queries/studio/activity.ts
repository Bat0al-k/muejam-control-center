export const GET_STUDIO_RECENT_ACTIVITY = `
    query GetStudioRecentActivity {
        Voice_Studio_payments(
        order_by: {
            created_at: desc
        }
        limit: 20
        ) {
        id
        user_id
        amount
        currency
        payment_method
        status
        transaction_id
        created_at
        }
    }
`;

export const GET_STUDIO_USER_ACTIVITIES = `
    query GetStudioUserActivities(
        $userId: uuid!
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_voice_generations(
        where: { user_id: { _eq: $userId } }
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        project_id
        text_content
        voice_name
        provider
        model_id
        created_at
        }
    }
`;


// export const GET_STUDIO_ACTIVITY_VOICE_GENERATION_INDEX = `
//     query GetStudioActivityVoiceGenerationIndex(
//         $limit: Int!
//         $offset: Int!
//     ) {
//         Voice_Studio_voice_generations(
//             order_by: { created_at: desc }
//             limit: $limit
//             offset: $offset
//         ) {
//             user_id
//             created_at
//         }
//     }
// `;


export const GET_STUDIO_ACTIVITY_VOICE_GENERATION_INDEX = `
    query GetStudioActivityVoiceGenerationIndex(
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_voice_generations(
            order_by: { created_at: desc }
            limit: $limit
            offset: $offset
        ) {
            created_at
            project {
                user_id
            }
        }
    }
`;

export const GET_STUDIO_USERS = `
    query GetStudioUsers {
        auth_users {
            id
            display_name
            email
            last_seen
            phone_number
            email_verified
            disabled
            default_role
        }
    }
`;

export const GET_STUDIO_RECENT_PAYMENTS = `
    query GetStudioRecentPayments {
        Voice_Studio_payments(
        order_by: {
            created_at: desc
        }
        limit: 20
        ) {
        id
        user_id
        amount
        currency
        payment_method
        status
        transaction_id
        created_at
        }
    }
`;

export const GET_STUDIO_RECENT_PROJECTS = `
    query GetStudioRecentProjects {
        Voice_Studio_projects(
        order_by: {
            crated_at: desc
        }
        limit: 20
        ) {
        id
        user_id
        name
        crated_at
        }
    }
`;

export const GET_STUDIO_RECENT_VOICE_GENERATIONS = `
    query GetStudioRecentVoiceGenerations {
        Voice_Studio_voice_generations(
        order_by: {
            created_at: desc
        }
        limit: 20
        ) {
        id
        project_id
        text_content
        voice_name
        provider
        model_id
        created_at
        }
    }
`;

export const GET_STUDIO_RECENT_AI_USAGE = `
    query GetStudioRecentAiUsage {
        Voice_Studio_ai_usage(
        order_by: {
            created_at: desc
        }
        limit: 20
        ) {
        id
        user_id
        project_id
        operation
        model
        prompt_tokens
        completion_tokens
        total_tokens
        total_cost_usd
        created_at
        }
    }
`;

export const GET_STUDIO_RECENT_TTS_REQUESTS = `
    query GetStudioRecentTtsRequests {
        Voice_Studio_tts_request(
        order_by: {
            created_at: desc
        }
        limit: 20
        ) {
        id
        user_id
        voice_id
        language
        output_formate
        processing_time
        status
        created_at
        }
    }
`;

export const GET_STUDIO_RECENT_USAGE_LOGS = `
    query GetStudioRecentUsageLogs {
        Voice_Studio_usage_logs(
        order_by: {
            created_at: desc
        }
        limit: 20
        ) {
        id
        user_id
        action
        chars_used
        ip_address
        device
        created_at
        }
    }
`;

export const GET_STUDIO_RECENT_TRANSCRIPTION_USAGE = `
    query GetStudioRecentTranscriptionUsage {
        Voice_Studio_transcription_usage(
        order_by: {
            created_at: desc
        }
        limit: 20
        ) {
        id
        user_id
        project_id
        provider
        model
        media_duration_seconds
        usage_seconds
        status
        estimated_cost_usd
        created_at
        }
    }
`;


/* _______________________ Activity Users & Details _______________________ */

// Fetch projects for a specific user.
export const GET_STUDIO_USER_PROJECTS = `
    query GetStudioUserProjects(
        $userId: uuid!
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_projects(
        where: { user_id: { _eq: $userId } }
        order_by: { crated_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        user_id
        name
        crated_at
        }
    }
`;

// Fetch payments for a specific user.
export const GET_STUDIO_USER_PAYMENTS = `
    query GetStudioUserPayments(
        $userId: uuid!
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_payments(
        where: { user_id: { _eq: $userId } }
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        user_id
        amount
        currency
        payment_method
        status
        transaction_id
        created_at
        }
    }
`;

// Fetch AI usage for a specific user.
export const GET_STUDIO_USER_AI_USAGE = `
    query GetStudioUserAiUsage(
        $userId: uuid!
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_ai_usage(
        where: { user_id: { _eq: $userId } }
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        user_id
        project_id
        operation
        model
        prompt_tokens
        completion_tokens
        total_tokens
        total_cost_usd
        created_at
        }
    }
`;

// Fetch text-to-speech requests for a specific user.
export const GET_STUDIO_USER_TTS_REQUESTS = `
    query GetStudioUserTtsRequests(
        $userId: uuid!
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_tts_request(
        where: { user_id: { _eq: $userId } }
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        user_id
        voice_id
        language
        output_formate
        processing_time
        status
        created_at
        }
    }
`;

// Fetch character usage logs for a specific user.
export const GET_STUDIO_USER_USAGE_LOGS = `
    query GetStudioUserUsageLogs(
        $userId: uuid!
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_usage_logs(
        where: { user_id: { _eq: $userId } }
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        user_id
        action
        chars_used
        ip_address
        device
        created_at
        }
    }
`;

// Fetch transcription usage for a specific user.
export const GET_STUDIO_USER_TRANSCRIPTION_USAGE = `
    query GetStudioUserTranscriptionUsage(
        $userId: uuid!
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_transcription_usage(
        where: { user_id: { _eq: $userId } }
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        user_id
        project_id
        provider
        model
        media_duration_seconds
        usage_seconds
        status
        estimated_cost_usd
        created_at
        }
    }
`;

// Fetch voice generations belonging to the user's projects.
export const GET_STUDIO_USER_VOICE_GENERATIONS = `
    query GetStudioUserVoiceGenerations(
        $projectIds: [uuid!]!
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_voice_generations(
        where: { project_id: { _in: $projectIds } }
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        project_id
        text_content
        voice_name
        provider
        model_id
        created_at
        }
    }
`;


/* _______________________ Activity User Discovery _______________________ */

export const GET_STUDIO_ACTIVITY_PAYMENT_INDEX = `
    query GetStudioActivityPaymentIndex($limit: Int!, $offset: Int!) {
        Voice_Studio_payments(
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        user_id
        created_at
        }
    }
`;

export const GET_STUDIO_ACTIVITY_PROJECT_INDEX = `
    query GetStudioActivityProjectIndex($limit: Int!, $offset: Int!) {
        Voice_Studio_projects(
        order_by: { crated_at: desc }
        limit: $limit
        offset: $offset
        ) {
        id
        user_id
        crated_at
        }
    }
`;

export const GET_STUDIO_ACTIVITY_AI_INDEX = `
    query GetStudioActivityAiIndex($limit: Int!, $offset: Int!) {
        Voice_Studio_ai_usage(
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        user_id
        created_at
        }
    }
`;

export const GET_STUDIO_ACTIVITY_TTS_INDEX = `
    query GetStudioActivityTtsIndex($limit: Int!, $offset: Int!) {
        Voice_Studio_tts_request(
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        user_id
        created_at
        }
    }
`;

export const GET_STUDIO_ACTIVITY_USAGE_INDEX = `
    query GetStudioActivityUsageIndex($limit: Int!, $offset: Int!) {
        Voice_Studio_usage_logs(
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        user_id
        created_at
        }
    }
`;

export const GET_STUDIO_ACTIVITY_TRANSCRIPTION_INDEX = `
    query GetStudioActivityTranscriptionIndex(
        $limit: Int!
        $offset: Int!
    ) {
        Voice_Studio_transcription_usage(
        order_by: { created_at: desc }
        limit: $limit
        offset: $offset
        ) {
        user_id
        created_at
        }
    }
`;