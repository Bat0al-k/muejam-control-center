import { NextRequest, NextResponse } from "next/server";

import { getCurrentAuth } from "@/lib/server-auth";
import { USER_ROLES } from "@/features/auth/roles";
import {
    updateStudioUser,
    deleteStudioUser,
} from "@/features/studio/studio.service";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await getCurrentAuth();

        if (!auth) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }

        if (auth.role !== USER_ROLES.DEVELOPER) {
            return NextResponse.json(
                { message: "Permission denied. Only developers can edit users." },
                { status: 403 }
            );
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { message: "User ID is required." },
                { status: 400 }
            );
        }

        const body = await request.json();
        const {
            displayName,
            email,
            phoneNumber,
            emailVerified,
            disabled,
            defaultRole,
        } = body;

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
        console.error("Studio user [id] PATCH error:", error);

        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : "Failed to update user.",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await getCurrentAuth();

        if (!auth) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }

        if (auth.role !== USER_ROLES.DEVELOPER) {
            return NextResponse.json(
                { message: "Permission denied. Only developers can delete users." },
                { status: 403 }
            );
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { message: "User ID is required." },
                { status: 400 }
            );
        }

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
        console.error("Studio user [id] DELETE error:", error);

        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : "Failed to delete user.",
            },
            { status: 500 }
        );
    }
}
