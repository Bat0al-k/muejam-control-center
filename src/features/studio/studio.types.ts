export interface StudioOverviewKpis {
    activeCreators: number;
    totalTransactions: number;
}

export interface StudioPaymentActivity {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: "successful" | "pending" | string;
    transactionId: string;
    createdAt: string;
}

export interface StudioOverviewData {
    kpis: StudioOverviewKpis;
    payments: StudioPaymentActivity[];
}

export interface StudioOverviewKpis {
    activeCreators: number;
    totalTransactions: number;
}

export interface StudioPaymentActivity {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
    transactionId: string;
    createdAt: string;
}

export interface StudioOverviewData {
    kpis: StudioOverviewKpis;
    payments: StudioPaymentActivity[];
}

export interface StudioPaymentActivity {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
    transactionId: string;
    createdAt: string;
}

export interface StudioActivity {
    id: string;
    userId: string;
    userName: string;
    userBadge: string;
    description: string;
    creditsChange: number;
    timestamp: string;
    timeAgo: string;
    eventType:
    | "Generations"
    | "Credits"
    | "Transactions"
    | "User Activity"
    | "System Events"
    | "Errors"
    | "API Events";
    transactionId?: string;
    status?: string;
    details?: string;
    avatarBg?: string;
    isStripe?: boolean;
}