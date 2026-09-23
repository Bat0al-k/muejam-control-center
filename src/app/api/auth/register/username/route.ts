import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/graphql/client";

const GET_USER_BY_EMAIL = `
    query GetUserByEmailForUsername($email: citext!) {
        auth_pending_registrations(
            where: { email: { _eq: $email } }
            limit: 1
        ) {
            id
            email
            email_verified
            username
            disabled
        }
    }
`;

const UPDATE_USER_USERNAME = `
    mutation UpdateUserUsername(
        $id: uuid!
        $username: String!
    ) {
        update_auth_pending_registrations_by_pk(
            pk_columns: { id: $id }
            _set: {
                username: $username
            }
        ) {
            id
            email
            username
        }
    }
`;

interface User {
    id: string;
    email: string;
    email_verified: boolean;
    username: string | null;
    disabled: boolean;
}

interface GetUserResponse {
    auth_pending_registrations: User[];
}

interface UpdateUsernameResponse {
    update_auth_pending_registrations_by_pk: {
        id: string;
        email: string;
        username: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const username =
            typeof body.username === "string"
                ? body.username.trim()
                : "";

        if (!email) {
            return NextResponse.json(
                { message: "Email is required." },
                { status: 400 }
            );
        }

        if (!username) {
            return NextResponse.json(
                { message: "Username is required." },
                { status: 400 }
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                {
                    message:
                        "Username must be at least 3 characters.",
                },
                { status: 400 }
            );
        }

        const data =
            await executeGraphQL<GetUserResponse>(
                GET_USER_BY_EMAIL,
                { email }
            );

        const user = data.auth_pending_registrations[0];

        if (!user) {
            return NextResponse.json(
                { message: "Registration session not found." },
                { status: 404 }
            );
        }

        if (user.disabled) {
            return NextResponse.json(
                { message: "This account is disabled." },
                { status: 403 }
            );
        }

        if (!user.email_verified) {
            return NextResponse.json(
                {
                    message:
                        "Please verify your email before setting a username.",
                },
                { status: 403 }
            );
        }

        await executeGraphQL<UpdateUsernameResponse>(
            UPDATE_USER_USERNAME,
            {
                id: user.id,
                username,
            }
        );

        return NextResponse.json({
            success: true,
            email: user.email,
        });
    } catch (error) {
        console.error("Register username error:", error);

        return NextResponse.json(
            {
                message:
                    "Unable to set username. Please try again.",
            },
            { status: 500 }
        );
    }
}