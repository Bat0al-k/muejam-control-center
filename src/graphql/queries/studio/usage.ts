export const GET_STUDIO_ACTIVE_CREATORS = `
    query GetStudioActiveCreators(
        $startDate: timestamptz!
        $endDate: timestamptz!
    ) {
        Voice_Studio_projects(
        where: {
            crated_at: {
            _gte: $startDate
            _lt: $endDate
            }
        }
        ) {
        user_id
        }
    }
`;

export const GET_STUDIO_USAGE = `
    query GetStudioUsage(
        $startDate: timestamptz!
        $endDate: timestamptz!
    ) {
        Voice_Studio_projects(
        where: {
            crated_at: {
            _gte: $startDate
            _lt: $endDate
            }
        }
        ) {
        user_id
        }

        Voice_Studio_usage_logs_aggregate(
        where: {
            created_at: {
            _gte: $startDate
            _lt: $endDate
            }
        }
        ) {
        aggregate {
            count
            sum {
            chars_used
            }
        }
        }
    }
`;