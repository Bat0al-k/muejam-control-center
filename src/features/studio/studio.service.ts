import { executeGraphQL } from "@/graphql/client";

import {
    GET_STUDIO_RECENT_PAYMENTS,
    GET_STUDIO_RECENT_PROJECTS,
    GET_STUDIO_RECENT_VOICE_GENERATIONS,
    GET_STUDIO_RECENT_AI_USAGE,
    GET_STUDIO_RECENT_TTS_REQUESTS,
    GET_STUDIO_RECENT_USAGE_LOGS,
    GET_STUDIO_RECENT_TRANSCRIPTION_USAGE,
    GET_STUDIO_USERS,

    GET_STUDIO_USER_PROJECTS,
    GET_STUDIO_USER_PAYMENTS,
    GET_STUDIO_USER_AI_USAGE,
    GET_STUDIO_USER_TTS_REQUESTS,
    GET_STUDIO_USER_USAGE_LOGS,
    GET_STUDIO_USER_TRANSCRIPTION_USAGE,
    GET_STUDIO_USER_VOICE_GENERATIONS,

    GET_STUDIO_ACTIVITY_PAYMENT_INDEX,
    GET_STUDIO_ACTIVITY_PROJECT_INDEX,
    GET_STUDIO_ACTIVITY_AI_INDEX,
    GET_STUDIO_ACTIVITY_TTS_INDEX,
    GET_STUDIO_ACTIVITY_USAGE_INDEX,
    GET_STUDIO_ACTIVITY_TRANSCRIPTION_INDEX,
    GET_STUDIO_ACTIVITY_VOICE_GENERATION_INDEX,
} from "@/graphql/queries/studio/activity";

import { GET_STUDIO_FEATURE_UTILIZATION } from "@/graphql/queries/studio/features";
import {
    UPDATE_STUDIO_USER,
    DELETE_STUDIO_USER,
} from "@/graphql/mutations/studio/users";
import { INSERT_STUDIO_PAYMENT } from "@/graphql/mutations/studio/payments";
import { formatBankAmount, normalizePaymentAmount } from "@/lib/formatters";

import type {
    StudioOverviewData,
    // StudioPaymentActivity,
    StudioActivity,
} from "./studio.types";

// _______________________ GraphQL Responses _______________________

interface ProjectsResponse {
    Voice_Studio_projects: {
        id: string;
        user_id: string;
        name: string;
        crated_at: string;
    }[];
}

interface VoiceGenerationsResponse {
    Voice_Studio_voice_generations: {
        id: string;
        project_id: string;
        text_content: string;
        voice_name: string | null;
        provider: string | null;
        model_id: string | null;
        created_at: string;
    }[];
}

interface AiUsageResponse {
    Voice_Studio_ai_usage: {
        id: string;
        user_id: string;
        project_id: string | null;
        operation: string;
        model: string;
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        total_cost_usd: number;
        created_at: string;
    }[];
}

interface TtsRequestsResponse {
    Voice_Studio_tts_request: {
        id: string;
        user_id: string;
        voice_id: string;
        language: string;
        output_formate: string;
        processing_time: number;
        status: string;
        created_at: string;
    }[];
}

interface UsageLogsResponse {
    Voice_Studio_usage_logs: {
        id: string;
        user_id: string;
        action: string;
        chars_used: number;
        ip_address: string | null;
        device: string | null;
        created_at: string;
    }[];
}

interface TranscriptionUsageResponse {
    Voice_Studio_transcription_usage: {
        id: string;
        user_id: string;
        project_id: string | null;
        provider: string;
        model: string | null;
        media_duration_seconds: number;
        usage_seconds: number;
        status: string;
        estimated_cost_usd: number | null;
        created_at: string;
    }[];
}

interface PaymentsResponse {
    Voice_Studio_payments: {
        id: string;
        user_id: string;
        amount: number;
        currency: string;
        payment_method: string;
        status: string;
        transaction_id: string;
        created_at: string;
    }[];
}

// interface UsersResponse {
//     auth_users: {
//         id: string;
//         display_name: string | null;
//         email: string | null;
//     }[];
// }


interface UsersResponse {
    auth_users: {
        id: string;
        display_name: string | null;
        email: string | null;
        last_seen: string | null;
        phone_number: string | null;
        email_verified: boolean | null;
        disabled: boolean | null;
        default_role: string | null;
    }[];
}

interface StudioUsersProjectsResponse {
    Voice_Studio_projects: {
        id: string;
        user_id: string;
    }[];
}

export interface StudioUser {
    id: string;
    displayName: string;
    email: string;
    lastSeen: string | null;
    phoneNumber: string | null;
    emailVerified: boolean;
    disabled: boolean;
    role: string;
    defaultRole: string;
    projectCount: number;
    online: boolean;
}

export interface StudioUsersData {
    users: StudioUser[];
    totalAccounts: number;
    onlineUsers: number;
    verifiedEmails: number;
}

// _______________________ Helpers _______________________

function getUserName(
    userId: string,
    usersMap: Map<string, string>,
): string {
    return usersMap.get(userId) || "Unknown User";
}

function formatTimeAgo(date: string): string {
    const timestamp = new Date(date).getTime();
    const now = Date.now();

    const diffInSeconds = Math.max(
        0,
        Math.floor((now - timestamp) / 1000),
    );

    if (diffInSeconds < 60) {
        return "Just now";
    }

    const minutes = Math.floor(diffInSeconds / 60);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
        return `${days}d ago`;
    }

    return new Date(date).toLocaleDateString();
}

// _______________________ Activity Mapper _______________________

function mapPaymentActivity(
    payments: PaymentsResponse["Voice_Studio_payments"],
    usersMap: Map<string, string>,
): StudioActivity[] {
    return payments.map((payment) => {
        // Paymob & payment gateways record amounts in minor units (piasters / cents).
        // e.g., 15000 piasters = 150.00 EGP, 25000 = 250.00 EGP, 500 = 5.00 EGP
        const normalizedAmount = normalizePaymentAmount(payment.amount, payment.payment_method);
        const formattedAmount = formatBankAmount(normalizedAmount, { currency: payment.currency });

        return {
            id: `payment-${payment.id}`,
            userId: payment.user_id,
            userName: getUserName(payment.user_id, usersMap),
            userBadge: "Payment",
            avatarBg: "bg-emerald-100 text-emerald-800",
            description: `${payment.payment_method} payment — ${payment.status}`,
            creditsChange: 0,
            timestamp: payment.created_at,
            timeAgo: formatTimeAgo(payment.created_at),
            eventType: "Transactions",
            transactionId: payment.transaction_id,
            status: payment.status,
            details: formattedAmount,
            isStripe: false,
        };
    });
}

function mapProjectActivity(
    projects: ProjectsResponse["Voice_Studio_projects"],
    usersMap: Map<string, string>,
): StudioActivity[] {
    return projects.map((project) => ({
        id: `project-${project.id}`,
        userId: project.user_id,
        userName: getUserName(project.user_id, usersMap),
        userBadge: "Project",
        avatarBg: "bg-blue-100 text-blue-800",
        description: `Created project "${project.name}"`,
        creditsChange: 0,
        timestamp: project.crated_at,
        timeAgo: formatTimeAgo(project.crated_at),
        eventType: "User Activity",
        status: "completed",
        details: `Project ID: ${project.id}`,
        isStripe: false,
    }));
}

function mapVoiceGenerationActivity(
    generations: VoiceGenerationsResponse["Voice_Studio_voice_generations"],
    projectsMap: Map<string, string>,
    usersMap: Map<string, string>,
): StudioActivity[] {
    return generations.map((generation) => {
        const userId = projectsMap.get(generation.project_id) || "";

        return {
            id: `generation-${generation.id}`,
            userId,
            userName: getUserName(userId, usersMap),
            userBadge: "Generation",
            avatarBg: "bg-purple-100 text-purple-800",
            description: `Voice generation using ${generation.voice_name || generation.provider || "voice model"
                }`,
            creditsChange: 0,
            timestamp: generation.created_at,
            timeAgo: formatTimeAgo(generation.created_at),
            eventType: "Generations",
            status: "completed",
            details: generation.text_content,
            isStripe: false,
        };
    });
}

function mapAiUsageActivity(
    aiUsage: AiUsageResponse["Voice_Studio_ai_usage"],
    usersMap: Map<string, string>,
): StudioActivity[] {
    return aiUsage.map((usage) => ({
        id: `ai-${usage.id}`,
        userId: usage.user_id,
        userName: getUserName(usage.user_id, usersMap),
        userBadge: "AI",
        avatarBg: "bg-cyan-100 text-cyan-800",
        description: `AI ${usage.operation} using ${usage.model}`,
        creditsChange: 0,
        timestamp: usage.created_at,
        timeAgo: formatTimeAgo(usage.created_at),
        eventType: "API Events",
        status: "completed",
        details: `${usage.total_tokens.toLocaleString()} tokens · $${usage.total_cost_usd}`,
        isStripe: false,
    }));
}

function mapTtsActivity(
    requests: TtsRequestsResponse["Voice_Studio_tts_request"],
    usersMap: Map<string, string>,
): StudioActivity[] {
    return requests.map((request) => ({
        id: `tts-${request.id}`,
        userId: request.user_id,
        userName: getUserName(request.user_id, usersMap),
        userBadge: "TTS",
        avatarBg: "bg-indigo-100 text-indigo-800",
        description: `TTS request — ${request.status}`,
        creditsChange: 0,
        timestamp: request.created_at,
        timeAgo: formatTimeAgo(request.created_at),
        eventType: "Generations",
        status: request.status,
        details: `${request.language} · ${request.output_formate}`,
        isStripe: false,
    }));
}

function mapUsageLogActivity(
    logs: UsageLogsResponse["Voice_Studio_usage_logs"],
    usersMap: Map<string, string>,
): StudioActivity[] {
    return logs.map((log) => ({
        id: `usage-${log.id}`,
        userId: log.user_id,
        userName: getUserName(log.user_id, usersMap),
        userBadge: "Usage",
        avatarBg: "bg-orange-100 text-orange-800",
        description: log.action,
        creditsChange: log.chars_used,
        timestamp: log.created_at,
        timeAgo: formatTimeAgo(log.created_at),
        eventType: "Credits",
        status: "completed",
        details: `${log.chars_used.toLocaleString()} characters`,
        isStripe: false,
    }));
}

function mapTranscriptionActivity(
    records: TranscriptionUsageResponse["Voice_Studio_transcription_usage"],
    usersMap: Map<string, string>,
): StudioActivity[] {
    return records.map((record) => ({
        id: `transcription-${record.id}`,
        userId: record.user_id,
        userName: getUserName(record.user_id, usersMap),
        userBadge: "Transcription",
        avatarBg: "bg-yellow-100 text-yellow-800",
        description: `Transcription — ${record.status}`,
        creditsChange: 0,
        timestamp: record.created_at,
        timeAgo: formatTimeAgo(record.created_at),
        eventType: "API Events",
        status: record.status,
        details: `${record.provider}${record.model ? ` · ${record.model}` : ""
            }`,
        isStripe: false,
    }));
}

// _______________________ Studio Overview _______________________

export async function getStudioOverview(
    startDate: string,
    endDate: string,
): Promise<StudioOverviewData> {
    const [projectsResult, paymentsResult, usersResult] =
        await Promise.all([
            executeGraphQL<ProjectsResponse>(
                GET_STUDIO_RECENT_PROJECTS,
            ),

            executeGraphQL<PaymentsResponse>(
                GET_STUDIO_RECENT_PAYMENTS,
            ),

            executeGraphQL<UsersResponse>(
                GET_STUDIO_USERS,
            ),
        ]);

    const uniqueCreators = new Set(
        projectsResult.Voice_Studio_projects
            .filter((project) => {
                const createdAt = new Date(project.crated_at).getTime();

                return (
                    createdAt >= new Date(startDate).getTime() &&
                    createdAt < new Date(endDate).getTime()
                );
            })
            .map((project) => project.user_id),
    );

    const payments = paymentsResult.Voice_Studio_payments.filter(
        (payment) => {
            const createdAt = new Date(payment.created_at).getTime();

            return (
                createdAt >= new Date(startDate).getTime() &&
                createdAt < new Date(endDate).getTime()
            );
        },
    );

    const usersMap = new Map(
        usersResult.auth_users.map((user) => [
            user.id,
            user.display_name || user.email || "Unknown User",
        ]),
    );

    return {
        kpis: {
            activeCreators: uniqueCreators.size,
            totalTransactions: payments.length,
        },
        payments: payments.map((payment) => ({
            id: payment.id,
            userId: payment.user_id,
            userName: getUserName(payment.user_id, usersMap),
            amount: normalizePaymentAmount(payment.amount, payment.payment_method),
            currency: payment.currency,
            paymentMethod: payment.payment_method,
            status: payment.status,
            transactionId: payment.transaction_id,
            createdAt: payment.created_at,
        })),
    };
}

// _______________________ Full Studio Activity _______________________

export async function getStudioRecentActivity(): Promise<StudioActivity[]> {
    const [
        paymentsResult,
        projectsResult,
        generationsResult,
        aiUsageResult,
        ttsResult,
        usageLogsResult,
        transcriptionResult,
        usersResult,
    ] = await Promise.all([
        executeGraphQL<PaymentsResponse>(
            GET_STUDIO_RECENT_PAYMENTS,
        ),

        executeGraphQL<ProjectsResponse>(
            GET_STUDIO_RECENT_PROJECTS,
        ),

        executeGraphQL<VoiceGenerationsResponse>(
            GET_STUDIO_RECENT_VOICE_GENERATIONS,
        ),

        executeGraphQL<AiUsageResponse>(
            GET_STUDIO_RECENT_AI_USAGE,
        ),

        executeGraphQL<TtsRequestsResponse>(
            GET_STUDIO_RECENT_TTS_REQUESTS,
        ),

        executeGraphQL<UsageLogsResponse>(
            GET_STUDIO_RECENT_USAGE_LOGS,
        ),

        executeGraphQL<TranscriptionUsageResponse>(
            GET_STUDIO_RECENT_TRANSCRIPTION_USAGE,
        ),

        executeGraphQL<UsersResponse>(
            GET_STUDIO_USERS,
        ),
    ]);

    const usersMap = new Map(
        usersResult.auth_users.map((user) => [
            user.id,
            user.display_name || user.email || "Unknown User",
        ]),
    );

    const projectsMap = new Map(
        projectsResult.Voice_Studio_projects.map((project) => [
            project.id,
            project.user_id,
        ]),
    );

    const activity: StudioActivity[] = [
        ...mapPaymentActivity(
            paymentsResult.Voice_Studio_payments,
            usersMap,
        ),

        ...mapProjectActivity(
            projectsResult.Voice_Studio_projects,
            usersMap,
        ),

        ...mapVoiceGenerationActivity(
            generationsResult.Voice_Studio_voice_generations,
            projectsMap,
            usersMap,
        ),

        ...mapAiUsageActivity(
            aiUsageResult.Voice_Studio_ai_usage,
            usersMap,
        ),

        ...mapTtsActivity(
            ttsResult.Voice_Studio_tts_request,
            usersMap,
        ),

        ...mapUsageLogActivity(
            usageLogsResult.Voice_Studio_usage_logs,
            usersMap,
        ),

        ...mapTranscriptionActivity(
            transcriptionResult.Voice_Studio_transcription_usage,
            usersMap,
        ),
    ];

    return activity.sort(
        (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime(),
    );
}


const ACTIVITY_PAGE_SIZE = 200;

interface ActivityIndexRow {
    user_id: string;
    created_at: string;
}


interface VoiceGenerationIndexRow {
    created_at: string;
    project: {
        user_id: string | null;
    } | null;
}

interface ProjectIndexRow extends ActivityIndexRow {
    id: string;
    user_id: string;
    crated_at: string;
}

interface ActivityUserSummary {
    userId: string;
    userName: string;
    email: string | null;
    latestActivityAt: string;
    activityCount: number;
}

async function getAllActivityPages<T>(
    query: string,
    fieldName: string,
    extraVariables: Record<string, unknown> = {},
): Promise<T[]> {
    const rows: T[] = [];
    let offset = 0;

    while (true) {
        const result = await executeGraphQL<Record<string, T[]>>(
            query,
            {
                ...extraVariables,
                limit: ACTIVITY_PAGE_SIZE,
                offset,
            },
        );

        const page = result[fieldName] ?? [];
        rows.push(...page);

        if (page.length < ACTIVITY_PAGE_SIZE) {
            break;
        }

        offset += ACTIVITY_PAGE_SIZE;
    }

    return rows;
}

export async function getStudioActivityUsers(): Promise<
    ActivityUserSummary[]
> {
    const [
        usersResult,
        payments,
        projects,
        aiUsage,
        ttsRequests,
        usageLogs,
        transcriptionUsage,
        voiceGenerations,
    ] = await Promise.all([
        executeGraphQL<UsersResponse>(GET_STUDIO_USERS),

        getAllActivityPages<ActivityIndexRow>(
            GET_STUDIO_ACTIVITY_PAYMENT_INDEX,
            "Voice_Studio_payments",
        ),

        getAllActivityPages<ProjectIndexRow>(
            GET_STUDIO_ACTIVITY_PROJECT_INDEX,
            "Voice_Studio_projects",
        ),

        getAllActivityPages<ActivityIndexRow>(
            GET_STUDIO_ACTIVITY_AI_INDEX,
            "Voice_Studio_ai_usage",
        ),

        getAllActivityPages<ActivityIndexRow>(
            GET_STUDIO_ACTIVITY_TTS_INDEX,
            "Voice_Studio_tts_request",
        ),

        getAllActivityPages<ActivityIndexRow>(
            GET_STUDIO_ACTIVITY_USAGE_INDEX,
            "Voice_Studio_usage_logs",
        ),

        getAllActivityPages<ActivityIndexRow>(
            GET_STUDIO_ACTIVITY_TRANSCRIPTION_INDEX,
            "Voice_Studio_transcription_usage",
        ),

        getAllActivityPages<ActivityIndexRow>(
            GET_STUDIO_ACTIVITY_VOICE_GENERATION_INDEX,
            "Voice_Studio_voice_generations",
        ),

        getAllActivityPages<VoiceGenerationIndexRow>(
            GET_STUDIO_ACTIVITY_VOICE_GENERATION_INDEX,
            "Voice_Studio_voice_generations",
        ),
    ]);

    console.log("Studio activity discovery:", {
        authUsers: usersResult.auth_users.length,
        payments: payments.length,
        projects: projects.length,
        aiUsage: aiUsage.length,
        ttsRequests: ttsRequests.length,
        usageLogs: usageLogs.length,
        transcriptionUsage: transcriptionUsage.length,
        voiceGenerations: voiceGenerations.length,
    });

    const usersMap = new Map(
        usersResult.auth_users.map((user) => [
            user.id,
            {
                userName:
                    user.display_name || user.email || "Unknown User",
                email: user.email,
            },
        ]),
    );


    const activitySources = {
        payments,
        projects,
        aiUsage,
        ttsRequests,
        usageLogs,
        transcriptionUsage,
        voiceGenerations,
    };

    for (const [source, rows] of Object.entries(activitySources)) {
        const ids = [
            ...new Set(
                rows
                    .map((row) => row.user_id)
                    .filter(Boolean),
            ),
        ];

        console.log(`[${source}]`, {
            uniqueUsers: ids.length,
            matchedUsers: ids.filter((id) => usersMap.has(id)).length,
            unmatchedUserIds: ids.filter((id) => !usersMap.has(id)),
        });
    }

    const summaryMap = new Map<string, ActivityUserSummary>();

    function recordActivity(
        userId: string,
        timestamp: string,
    ) {
        if (!userId) return;

        // const user = usersMap.get(userId);

        // // Ignore users without a matching auth record.
        // if (!user) return;

        const user = usersMap.get(userId);

        const userName =
            user?.userName ?? `Unknown User (${userId.slice(0, 8)})`;

        const email = user?.email ?? null;

        const existing = summaryMap.get(userId);

        if (existing) {
            existing.activityCount += 1;

            if (
                new Date(timestamp).getTime() >
                new Date(existing.latestActivityAt).getTime()
            ) {
                existing.latestActivityAt = timestamp;
            }

            return;
        }

        // summaryMap.set(userId, {
        //     userId,
        //     userName: user.userName,
        //     email: user.email,
        //     latestActivityAt: timestamp,
        //     activityCount: 1,
        // });

        summaryMap.set(userId, {
            userId,
            userName,
            email,
            latestActivityAt: timestamp,
            activityCount: 1,
        });
    }

    for (const row of payments) {
        recordActivity(row.user_id, row.created_at);
    }

    for (const row of projects) {
        recordActivity(row.user_id, row.crated_at);
    }

    for (const row of aiUsage) {
        recordActivity(row.user_id, row.created_at);
    }

    for (const row of ttsRequests) {
        recordActivity(row.user_id, row.created_at);
    }

    for (const row of usageLogs) {
        recordActivity(row.user_id, row.created_at);
    }

    for (const row of transcriptionUsage) {
        recordActivity(row.user_id, row.created_at);
    }

    for (const row of voiceGenerations) {
        recordActivity(row.user_id, row.created_at);
    }

    console.log("Final Studio activity users:", summaryMap.size);

    return Array.from(summaryMap.values()).sort(
        (a, b) =>
            new Date(b.latestActivityAt).getTime() -
            new Date(a.latestActivityAt).getTime(),
    );
}

export async function getStudioUserActivityDetails(userId: string) {
    const usersResult = await executeGraphQL<UsersResponse>(
        GET_STUDIO_USERS,
    );

    const user = usersResult.auth_users.find(
        (item) => item.id === userId,
    );

    if (!user) {
        return null;
    }

    const projects = await getAllActivityPages<
        ProjectsResponse["Voice_Studio_projects"][number]
    >(
        GET_STUDIO_USER_PROJECTS,
        "Voice_Studio_projects",
        { userId },
    );

    const projectIds = projects.map((project) => project.id);

    const [
        payments,
        aiUsage,
        ttsRequests,
        usageLogs,
        transcriptionUsage,
        voiceGenerations,
    ] = await Promise.all([
        getAllActivityPages<
            PaymentsResponse["Voice_Studio_payments"][number]
        >(
            GET_STUDIO_USER_PAYMENTS,
            "Voice_Studio_payments",
            { userId },
        ),

        getAllActivityPages<
            AiUsageResponse["Voice_Studio_ai_usage"][number]
        >(
            GET_STUDIO_USER_AI_USAGE,
            "Voice_Studio_ai_usage",
            { userId },
        ),

        getAllActivityPages<
            TtsRequestsResponse["Voice_Studio_tts_request"][number]
        >(
            GET_STUDIO_USER_TTS_REQUESTS,
            "Voice_Studio_tts_request",
            { userId },
        ),

        getAllActivityPages<
            UsageLogsResponse["Voice_Studio_usage_logs"][number]
        >(
            GET_STUDIO_USER_USAGE_LOGS,
            "Voice_Studio_usage_logs",
            { userId },
        ),

        getAllActivityPages<
            TranscriptionUsageResponse[
            "Voice_Studio_transcription_usage"
            ][number]
        >(
            GET_STUDIO_USER_TRANSCRIPTION_USAGE,
            "Voice_Studio_transcription_usage",
            { userId },
        ),

        projectIds.length > 0
            ? getAllActivityPages<
                VoiceGenerationsResponse[
                "Voice_Studio_voice_generations"
                ][number]
            >(
                GET_STUDIO_USER_VOICE_GENERATIONS,
                "Voice_Studio_voice_generations",
                { projectIds },
            )
            : Promise.resolve([]),
    ]);

    const normalizedPayments = payments.map((p) => ({
        ...p,
        amount: normalizePaymentAmount(p.amount, p.payment_method),
    }));

    return {
        user: {
            id: user.id,
            name: user.display_name || user.email || "Unknown User",
            email: user.email,
        },
        projects,
        payments: normalizedPayments,
        aiUsage,
        ttsRequests,
        usageLogs,
        transcriptionUsage,
        voiceGenerations,
    };
}

// _______________________ Feature Utilization _______________________

// export async function getFeatureUtilization(
//     startDate: string,
//     endDate: string
// ): Promise<{
//     aiCostUsd: number;
//     voiceCostUsd: number;
//     totalCostUsd: number;
//     aiGenerations: number;
//     voiceGenerations: number;
//     voiceMinutes: number;
// }> {
//     const [aiResult, voiceResult] = await Promise.all([
//         executeGraphQL<{ Voice_Studio_ai_usage: { total_cost_usd: number; }[] }>(GET_STUDIO_FEATURE_UTILIZATION, {
//             startDate,
//             endDate
//         }),
//         executeGraphQL<{ Voice_Studio_voice_generations: { duration_seconds: number; }[] }>(GET_STUDIO_FEATURE_UTILIZATION, {
//             startDate,
//             endDate
//         })
//     ]);

//     const aiGenerations = aiResult.Voice_Studio_ai_usage.length;
//     const voiceGenerations = voiceResult.Voice_Studio_voice_generations.length;

//     const aiCostUsd = aiResult.Voice_Studio_ai_usage.reduce((sum, usage) => sum + usage.total_cost_usd, 0);
//     const voiceCostUsd = 0;
//     const totalCostUsd = aiCostUsd + voiceCostUsd;

//     const voiceMinutes = voiceResult.Voice_Studio_voice_generations.reduce((sum, gen) => sum + gen.duration_seconds, 0) / 60;

//     return {
//         aiCostUsd,
//         voiceCostUsd,
//         totalCostUsd,
//         aiGenerations,
//         voiceGenerations,
//         voiceMinutes
//     };
// }


// interface FeatureUtilizationResponse {
//     Voice_Studio_ai_usage: {
//         id: string;
//         operation: string;
//         model: string;
//         total_cost_usd: number;
//         created_at: string;
//     }[];

//     Voice_Studio_voice_generations: {
//         id: string;
//         voice_name: string | null;
//         provider: string | null;
//         model_id: string | null;
//         created_at: string;
//     }[];

//     Voice_Studio_videos: {
//         id: string;
//         created_at: string;
//     }[];

//     Voice_Studio_semantic_images: {
//         id: string;
//         created_at: string;
//         status: string | null;
//         model_version: string | null;
//     }[];
// }

// export interface StudioFeatureUsage {
//     aiTextCount: number;
//     voiceGenerationCount: number;
//     videoCount: number;
//     imageCount: number;
//     // videoGenerationCount: number;
//     // imageGenerationCount: number;
//     // aiTextCostUsd: number;
//     // voiceCostUsd: number;
//     // videoCostUsd: number;
//     // imageCostUsd: number;
//     // totalCostUsd: number;
// }

// export async function getStudioFeatureUtilization(
//     startDate: string,
//     endDate: string,
// ): Promise<StudioFeatureUsage> {
//     const result = await executeGraphQL<FeatureUtilizationResponse>(
//         GET_STUDIO_FEATURE_UTILIZATION,
//         {
//             startDate,
//             endDate,
//         },
//     );

//     return {
//         aiTextCount: result.Voice_Studio_ai_usage.length,
//         voiceGenerationCount: result.Voice_Studio_voice_generations.length,
//         videoCount: result.Voice_Studio_videos.length,
//         imageCount: result.Voice_Studio_semantic_images.length,
//     };

// }


interface FeatureUtilizationResponse {
    aiTextSummary: {
        aggregate: {
            count: number;
            sum: {
                total_tokens: number | null;
                total_cost_usd: number | string | null;
            } | null;
        } | null;
    };

    aiTextRecent: {
        id: string;
        operation: string;
        model: string;
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        total_cost_usd: number | string;
        created_at: string;
    }[];

    voiceSummary: {
        aggregate: {
            count: number;
        } | null;
    };

    voiceRecent: {
        id: string;
        voice_name: string | null;
        provider: string | null;
        model_id: string | null;
        text_content: string;
        created_at: string | null;
    }[];

    videoSummary: {
        aggregate: {
            count: number;
        } | null;
    };

    videoRecent: {
        id: string;
        title: string | null;
        duration: number | string | null;
        url: string | null;
        created_at: string | null;
    }[];

    imageSummary: {
        aggregate: {
            count: number;
        } | null;
    };

    indexedImageSummary: {
        aggregate: {
            count: number;
        } | null;
    };

    imageRecent: {
        id: string;
        name: string;
        category: string | null;
        width: number;
        height: number;
        mime_type: string;
        size_bytes: number;
        status: string;
        model_version: string | null;
        indexed_at: string | null;
        created_at: string;
        error_message: string | null;
    }[];
}

export interface StudioFeatureUsage {
    aiTextCount: number;
    voiceGenerationCount: number;
    videoCount: number;
    imageCount: number;
    indexedImageCount: number;
    aiTextTotalTokens: number;
    aiTextTotalCostUsd: number;

    aiTextRecent: FeatureUtilizationResponse["aiTextRecent"];
    voiceRecent: FeatureUtilizationResponse["voiceRecent"];
    videoRecent: FeatureUtilizationResponse["videoRecent"];
    imageRecent: FeatureUtilizationResponse["imageRecent"];
}

function toNumber(value: number | string | null | undefined): number {
    if (value == null) return 0;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

export async function getStudioFeatureUtilization(
    startDate: string,
    endDate: string,
): Promise<StudioFeatureUsage> {
    const result = await executeGraphQL<FeatureUtilizationResponse>(
        GET_STUDIO_FEATURE_UTILIZATION,
        {
            startDate,
            endDate,
        },
    );

    const aiSummary = result.aiTextSummary.aggregate;
    const voiceSummary = result.voiceSummary.aggregate;
    const videoSummary = result.videoSummary.aggregate;
    const imageSummary = result.imageSummary.aggregate;
    const indexedImageSummary = result.indexedImageSummary.aggregate;

    return {
        aiTextCount: aiSummary?.count ?? 0,
        voiceGenerationCount: voiceSummary?.count ?? 0,
        videoCount: videoSummary?.count ?? 0,
        imageCount: imageSummary?.count ?? 0,
        indexedImageCount: indexedImageSummary?.count ?? 0,

        aiTextTotalTokens: toNumber(
            aiSummary?.sum?.total_tokens,
        ),
        aiTextTotalCostUsd: toNumber(
            aiSummary?.sum?.total_cost_usd,
        ),

        aiTextRecent: result.aiTextRecent,
        voiceRecent: result.voiceRecent,
        videoRecent: result.videoRecent,
        imageRecent: result.imageRecent,
    };
}

// __________________________________ Get Studio Users __________________________________

export async function getStudioUsers(): Promise<StudioUsersData> {
    const [usersResult, projectsResult] = await Promise.all([
        executeGraphQL<UsersResponse>(GET_STUDIO_USERS),
        executeGraphQL<StudioUsersProjectsResponse>(`
            query GetAllStudioUserProjects {
                Voice_Studio_projects {
                    id
                    user_id
                }
            }
        `),
    ]);

    const projectsCount = new Map<string, number>();

    for (const project of projectsResult.Voice_Studio_projects) {
        projectsCount.set(
            project.user_id,
            (projectsCount.get(project.user_id) ?? 0) + 1,
        );
    }

    const now = Date.now();
    const onlineThreshold = 5 * 60 * 1000;

    const users: StudioUser[] = usersResult.auth_users.map((user) => {
        const lastSeenTime = user.last_seen
            ? new Date(user.last_seen).getTime()
            : Number.NaN;

        const online =
            !user.disabled &&
            Number.isFinite(lastSeenTime) &&
            now - lastSeenTime >= 0 &&
            now - lastSeenTime <= onlineThreshold;

        return {
            id: user.id,
            displayName: user.display_name?.trim() || "Unnamed User",
            email: user.email ?? "",
            lastSeen: user.last_seen,
            phoneNumber: user.phone_number,
            emailVerified: user.email_verified === true,
            disabled: user.disabled === true,
            role: user.default_role || "author",
            defaultRole: user.default_role || "author",
            projectCount: projectsCount.get(user.id) ?? 0,
            online,
        };
    });

    return {
        users,
        totalAccounts: users.length,
        onlineUsers: users.filter((user) => user.online).length,
        verifiedEmails: users.filter((user) => user.emailVerified).length,
    };
}

// __________________________________ Manage Studio Users (Developer Only) __________________________________

export interface UpdateStudioUserData {
    displayName?: string;
    email?: string;
    phoneNumber?: string | null;
    emailVerified?: boolean;
    disabled?: boolean;
    defaultRole?: string;
}

export async function updateStudioUser(
    id: string,
    updates: UpdateStudioUserData
) {
    const result = await executeGraphQL<{
        update_auth_users_by_pk: {
            id: string;
            display_name: string | null;
            email: string | null;
            phone_number: string | null;
            email_verified: boolean | null;
            disabled: boolean | null;
            default_role: string | null;
            last_seen: string | null;
        } | null;
    }>(UPDATE_STUDIO_USER, {
        id,
        displayName: updates.displayName,
        email: updates.email,
        phoneNumber: updates.phoneNumber,
        emailVerified: updates.emailVerified,
        disabled: updates.disabled,
        defaultRole: updates.defaultRole,
    });

    if (!result.update_auth_users_by_pk) {
        throw new Error("User not found or update failed.");
    }

    return result.update_auth_users_by_pk;
}

export async function deleteStudioUser(id: string) {
    const result = await executeGraphQL<{
        delete_auth_users_by_pk: {
            id: string;
        } | null;
    }>(DELETE_STUDIO_USER, { id });

    if (!result.delete_auth_users_by_pk) {
        throw new Error("User not found or already deleted.");
    }

    return result.delete_auth_users_by_pk;
}

export interface CreateStudioPaymentInput {
    userId: string;
    amount: number;
    currency?: string;
    paymentMethod?: string;
    status?: string;
    transactionId?: string;
    planId?: string;
}

export async function createStudioPayment(input: CreateStudioPaymentInput) {
    if (typeof input.amount !== "number" || Number.isNaN(input.amount) || input.amount <= 0) {
        throw new Error(
            "A valid payment amount greater than 0.00 is required to record a transaction."
        );
    }

    const defaultPlanId = "dead6c08-8596-4be0-a0e0-674e88d0687a";
    const transactionId =
        input.transactionId?.trim() ||
        `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Paymob and gateway payments are saved in minor units (e.g. 15000 piasters for 150.00 EGP)
    const amountInMinorUnits = Math.round(Number(input.amount) * 100);

    const result = await executeGraphQL<{
        insert_Voice_Studio_payments_one: {
            id: string;
            user_id: string;
            amount: number;
            currency: string;
            payment_method: string;
            status: string;
            transaction_id: string;
            plan_id: string;
            created_at: string;
        } | null;
    }>(INSERT_STUDIO_PAYMENT, {
        userId: input.userId,
        amount: amountInMinorUnits,
        currency: input.currency?.trim() || "USD",
        paymentMethod: input.paymentMethod?.trim() || "card",
        status: input.status?.trim() || "successful",
        transactionId,
        planId: input.planId || defaultPlanId,
    });

    if (!result.insert_Voice_Studio_payments_one) {
        throw new Error("Failed to record payment transaction.");
    }

    const created = result.insert_Voice_Studio_payments_one;
    return {
        ...created,
        amount: normalizePaymentAmount(created.amount, created.payment_method),
    };
}
