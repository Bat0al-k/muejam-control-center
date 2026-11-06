import { NextRequest, NextResponse } from "next/server";
import { getCurrentAuth } from "@/lib/server-auth";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/features/auth/permissions";
import { getLibraryUserDetails } from "@/features/library/library.service";

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const auth = await getCurrentAuth();

        if (!auth) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 },
            );
        }

        const permissions = ROLE_PERMISSIONS[auth.role] ?? [];
        if (
            !permissions.includes(PERMISSIONS.LIBRARY_VIEW) &&
            !permissions.includes(PERMISSIONS.USERS_VIEW)
        ) {
            return NextResponse.json(
                { message: "Access forbidden" },
                { status: 403 },
            );
        }

        const userId = params.id;
        if (!userId) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 },
            );
        }

        const details = await getLibraryUserDetails(userId);
        if (!details) {
            return NextResponse.json(
                { message: "Library user not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(details);
    } catch (error) {
        console.error("Library user details GET error:", error);
        return NextResponse.json(
            { message: "Failed to load Library user details" },
            { status: 500 },
        );
    }
}

