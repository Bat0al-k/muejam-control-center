import { NextResponse } from "next/server";
import { getCurrentAuth } from "@/lib/server-auth";
import { USER_ROLES } from "@/features/auth/roles";
import { ROLE_PERMISSIONS } from "@/features/auth/permissions";

export async function GET() {
    try {
        const auth = await getCurrentAuth();

        if (!auth) {
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 401 }
            );
        }

        const isDeveloper = auth.role === USER_ROLES.DEVELOPER;
        const permissions = ROLE_PERMISSIONS[auth.role] ?? [];

        return NextResponse.json({
            authenticated: true,
            user: {
                id: auth.userId,
                role: auth.role,
                isDeveloper,
                permissions,
            },
        });
    } catch (error) {
        console.error("Auth me error:", error);

        return NextResponse.json(
            { message: "Failed to resolve session." },
            { status: 500 }
        );
    }
}
