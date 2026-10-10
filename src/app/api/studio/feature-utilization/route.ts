
import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { getStudioFeatureUtilization } from "@/features/studio/studio.service";

export async function GET(request: NextRequest) {
    try {
        await requirePermission(PERMISSIONS.STUDIO_VIEW);

        const { searchParams } = new URL(request.url);

        const endDate = searchParams.get("endDate");
        const startDate = searchParams.get("startDate");

        if (!startDate || !endDate) {
            return NextResponse.json(
                { message: "startDate and endDate are required" },
                { status: 400 },
            );
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start >= end
        ) {
            return NextResponse.json(
                { message: "Invalid date range" },
                { status: 400 },
            );
        }

        const usage = await getStudioFeatureUtilization(
            start.toISOString(),
            end.toISOString(),
        );

        return NextResponse.json({
            usage,
            dataSource: "live",
        });
    } catch (error) {
        console.error("Studio feature utilization error:", error);

        return NextResponse.json(
            {
                message: "Failed to load Studio feature utilization",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            { status: 500 },
        );
    }
}