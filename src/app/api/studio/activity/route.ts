import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { getStudioRecentActivity } from "@/features/studio/studio.service";

export async function GET() {
    try {
        await requirePermission(PERMISSIONS.STUDIO_VIEW);

        const activity = await getStudioRecentActivity();

        return NextResponse.json({
            activity,
        });
    } catch (error) {
        console.error("Studio activity error:", error);

        return NextResponse.json(
            {
                message: "Failed to load Studio activity",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            {
                status: 500,
            },
        );
    }
}