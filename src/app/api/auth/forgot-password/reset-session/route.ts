import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
    RESET_TOKEN_COOKIE,
    verifyPasswordResetToken,
} from "@/lib/password-reset";

export async function GET() {
    try {
        const cookieStore = await cookies();

        const token =
            cookieStore.get(RESET_TOKEN_COOKIE)?.value;

        if (!token) {
            return NextResponse.json(
                {
                    valid: false,
                },
                { status: 401 }
            );
        }

        const payload =
            verifyPasswordResetToken(token);

        if (!payload) {
            return NextResponse.json(
                {
                    valid: false,
                },
                { status: 401 }
            );
        }

        return NextResponse.json({
            valid: true,
        });
    } catch (error) {
        console.error(
            "Reset session verification error:",
            error
        );

        return NextResponse.json(
            {
                valid: false,
            },
            { status: 401 }
        );
    }
}
