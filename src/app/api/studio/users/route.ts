import { NextRequest, NextResponse } from "next/server";

import { getCurrentAuth } from "@/lib/server-auth";
import { USER_ROLES } from "@/features/auth/roles";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/features/auth/permissions";
import {
    getStudioUsers,
    updateStudioUser,
    deleteStudioUser,
} from "@/features/studio/studio.service";

export async function GET() {
    try {
        const auth = await getCurrentAuth();

        if (!auth) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }

        const permissions = ROLE_PERMISSIONS[auth.role] ?? [];
        if (!permissions.includes(PERMISSIONS.STUDIO_VIEW)) {
            return NextResponse.json(
                { message: "Access forbidden" },
                { status: 403 }
            );
        }

        const data = await getStudioUsers();

        return NextResponse.json({
            ...data,
            currentUser: {
                id: auth.userId,
                role: auth.role,
                isDeveloper: auth.role === USER_ROLES.DEVELOPER,
            },
        });
    } catch (error) {
        console.error("Studio users GET error:", error);

        return NextResponse.json(
            { message: "Failed to load Studio users" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const auth = await getCurrentAuth();

        if (!auth) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }

        // STRICT DEVELOPER ONLY CHECK
        if (auth.role !== USER_ROLES.DEVELOPER) {
            return NextResponse.json(
                { message: "Permission denied. Only developers can edit users." },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            id,
            displayName,
            email,
            phoneNumber,
            emailVerified,
            disabled,
            defaultRole,
        } = body;

        if (!id || typeof id !== "string") {
            return NextResponse.json(
                { message: "Valid user ID is required." },
                { status: 400 }
            );
        }

        const updatedUser = await updateStudioUser(id, {
            displayName: typeof displayName === "string" ? displayName.trim() : undefined,
            email: typeof email === "string" ? email.trim().toLowerCase() : undefined,
            phoneNumber: phoneNumber !== undefined ? (phoneNumber ? String(phoneNumber).trim() : null) : undefined,
            emailVerified: typeof emailVerified === "boolean" ? emailVerified : undefined,
            disabled: typeof disabled === "boolean" ? disabled : undefined,
            defaultRole: typeof defaultRole === "string" ? defaultRole : undefined,
        });

        return NextResponse.json({
            message: "User updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Studio users PATCH error:", error);

        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : "Failed to update user.",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const auth = await getCurrentAuth();

        if (!auth) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }

        // STRICT DEVELOPER ONLY CHECK
        if (auth.role !== USER_ROLES.DEVELOPER) {
            return NextResponse.json(
                { message: "Permission denied. Only developers can delete users." },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        let id = searchParams.get("id");

        if (!id) {
            try {
                const body = await request.json();
                id = body.id;
            } catch {
                // query param check above is sufficient
            }
        }

        if (!id || typeof id !== "string") {
            return NextResponse.json(
                { message: "Valid user ID is required." },
                { status: 400 }
            );
        }

        // Prevent developers from deleting their own account accidentally
        if (auth.userId === id) {
            return NextResponse.json(
                { message: "You cannot delete your own active developer account." },
                { status: 400 }
            );
        }

        const deleted = await deleteStudioUser(id);

        return NextResponse.json({
            message: "User deleted successfully.",
            id: deleted.id,
        });
    } catch (error) {
        console.error("Studio users DELETE error:", error);

        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : "Failed to delete user.",
            },
            { status: 500 }
        );
    }
}