
import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { getStudioUserActivityDetails } from "@/features/studio/studio.service";

interface RouteContext {
    params: Promise<{ userId: string }>;
}

export async function GET(
    _request: Request,
    { params }: RouteContext,
) {
    try {
        await requirePermission(PERMISSIONS.STUDIO_VIEW);

        const { userId } = await params;

        const isValidUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                .test(userId);

        if (!isValidUuid) {
            return NextResponse.json(
                { message: "Invalid user ID" },
                { status: 400 },
            );
        }

        const details = await getStudioUserActivityDetails(userId);

        if (!details) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(details);
    } catch (error) {
        console.error("Studio user activity details error:", error);

        return NextResponse.json(
            { message: "Failed to load user activity details" },
            { status: 500 },
        );
    }
}