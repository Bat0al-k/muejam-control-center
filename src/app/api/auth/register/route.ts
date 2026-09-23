import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/features/auth/register.service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        // Validate email exists
        if (!email) {
            return NextResponse.json(
                {
                    message: "Email is required.",
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    message: "Please enter a valid email address.",
                },
                { status: 400 }
            );
        }

        // Create/update pending registration + generate OTP + send email
        const result = await registerUser(email);

        return NextResponse.json({
            success: true,
            email: result.email,
            requiresVerification: result.requiresVerification,
        });
    } catch (error) {
        console.error("Register error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Unable to register.";

        // Email already belongs to a registered account
        if (
            message ===
            "This email is already registered. Please login."
        ) {
            return NextResponse.json(
                {
                    message,
                },
                { status: 409 }
            );
        }

        // Account exists but is disabled
        if (message === "This account is disabled.") {
            return NextResponse.json(
                {
                    message,
                },
                { status: 403 }
            );
        }

        return NextResponse.json(
            {
                message:
                    "Unable to create your account. Please try again.",
            },
            { status: 500 }
        );
    }
}