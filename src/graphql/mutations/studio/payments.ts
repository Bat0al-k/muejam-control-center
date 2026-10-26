export const INSERT_STUDIO_PAYMENT = `
    mutation InsertStudioPayment(
        $userId: uuid!
        $amount: float8!
        $currency: String!
        $paymentMethod: String!
        $status: String!
        $transactionId: String!
        $planId: uuid!
    ) {
        insert_Voice_Studio_payments_one(
            object: {
                user_id: $userId
                amount: $amount
                currency: $currency
                payment_method: $paymentMethod
                status: $status
                transaction_id: $transactionId
                plan_id: $planId
            }
        ) {
            id
            user_id
            amount
            currency
            payment_method
            status
            transaction_id
            plan_id
            created_at
        }
    }
`;
