
import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { getStudioUsers } from "@/features/studio/studio.service";

export async function GET() {
    try {
        await requirePermission(PERMISSIONS.STUDIO_VIEW);

        const data = await getStudioUsers();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Studio users error:", error);

        return NextResponse.json(
            { message: "Failed to load Studio users" },
            { status: 500 },
        );
    }
}