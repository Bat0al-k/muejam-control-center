import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { getStudioOverview } from "@/features/studio/studio.service";

function getDateRange(
    range: string,
    customStart?: string | null,
    customEnd?: string | null,
) {
    const now = new Date();

    if (
        range === "custom" &&
        customStart &&
        customEnd
    ) {
        return {
            startDate: `${customStart}T00:00:00.000Z`,
            endDate: `${customEnd}T23:59:59.999Z`,
        };
    }

    if (range === "7d") {
        const start = new Date(now);
        start.setUTCDate(start.getUTCDate() - 7);

        return {
            startDate: start.toISOString(),
            endDate: now.toISOString(),
        };
    }

    if (range === "this_month") {
        const start = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                1,
            ),
        );

        return {
            startDate: start.toISOString(),
            endDate: now.toISOString(),
        };
    }

    if (range === "prev_month") {
        const start = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth() - 1,
                1,
            ),
        );

        const end = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                1,
            ),
        );

        return {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
        };
    }

    const start = new Date(now);
    start.setUTCDate(start.getUTCDate() - 30);

    return {
        startDate: start.toISOString(),
        endDate: now.toISOString(),
    };
}

export async function GET(request: NextRequest) {
    try {
        await requirePermission(PERMISSIONS.STUDIO_VIEW);

        const { searchParams } = new URL(request.url);

        const range = searchParams.get("range") ?? "30d";
        const customStart = searchParams.get("start");
        const customEnd = searchParams.get("end");

        const { startDate, endDate } = getDateRange(
            range,
            customStart,
            customEnd,
        );

        const data = await getStudioOverview(
            startDate,
            endDate,
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error("Studio overview error:", error);

        return NextResponse.json(
            {
                message: "Failed to load studio overview",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            { status: 500 },
        );
    }
}