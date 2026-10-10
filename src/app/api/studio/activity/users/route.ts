
import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { getStudioActivityUsers } from "@/features/studio/studio.service";

export async function GET() {
    try {
        await requirePermission(PERMISSIONS.STUDIO_VIEW);

        const users = await getStudioActivityUsers();

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Studio activity users error:", error);

        return NextResponse.json(
            { message: "Failed to load Studio activity users" },
            { status: 500 },
        );
    }
}