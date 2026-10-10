export const GET_STUDIO_PAYMENTS = `
    query GetStudioPayments(
        $startDate: timestamptz!
        $endDate: timestamptz!
    ) {
        Voice_Studio_payments(
        where: {
            created_at: {
            _gte: $startDate
            _lt: $endDate
            }
        }
        order_by: {
            created_at: desc
        }
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