import { NextRequest, NextResponse } from "next/server";
import { completeRegistration } from "@/features/auth/register.service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        if (!email) {
            return NextResponse.json(
                {
                    message: "Email is required.",
                },
                { status: 400 }
            );
        }

        const result =
            await completeRegistration(email);

        return NextResponse.json({
            success: true,
            id: result.id,
            email: result.email,
            message:
                "Registration completed successfully.",
        });
    } catch (error) {
        console.error(
            "Complete registration error:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Unable to complete registration. Please try again.";

        return NextResponse.json(
            { message },
            { status: 400 }
        );
    }
}