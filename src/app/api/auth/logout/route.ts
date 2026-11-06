import { NextResponse } from "next/server";
import { getCurrentAuth } from "@/lib/server-auth";
import { executeGraphQL } from "@/graphql/client";
import { TERMINATE_USER_ALL_SESSIONS } from "@/graphql/queries/studio/users";

async function terminateCurrentUserSessions() {
    try {
        const auth = await getCurrentAuth();
        if (auth?.userId) {
            await executeGraphQL(TERMINATE_USER_ALL_SESSIONS, {
                userId: auth.userId,
                now: new Date().toISOString(),
            });
        }
    } catch (err) {
        console.error("Logout session termination warning:", err);
    }
}

export async function POST() {
    await terminateCurrentUserSessions();

    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully.",
    });

    response.cookies.set({
        name: "token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    return response;
}

export async function GET(request: Request) {
    await terminateCurrentUserSessions();

    const url = new URL("/login", request.url);
    const response = NextResponse.redirect(url);

    response.cookies.set({
        name: "token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    return response;
}
