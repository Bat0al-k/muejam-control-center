import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { executeGraphQL } from "@/graphql/client";

const GET_PENDING_REGISTRATION = `
    query GetPendingRegistrationForPassword($email: citext!) {
        auth_pending_registrations(
            where: { email: { _eq: $email } }
            limit: 1
        ) {
            id
            email
            email_verified
            username
            password_hash
            expires_at
        }
    }
`;

const UPDATE_PENDING_PASSWORD = `
    mutation UpdatePendingPassword(
        $id: uuid!
        $passwordHash: String!
    ) {
        update_auth_pending_registrations_by_pk(
            pk_columns: { id: $id }
            _set: {
                password_hash: $passwordHash
            }
        ) {
            id
            email
            username
            password_hash
        }
    }
`;

interface PendingRegistration {
    id: string;
    email: string;
    email_verified: boolean;
    username: string | null;
    password_hash: string | null;
    expires_at: string;
}

interface GetPendingRegistrationResponse {
    auth_pending_registrations: PendingRegistration[];
}

interface UpdatePasswordResponse {
    update_auth_pending_registrations_by_pk: {
        id: string;
        email: string;
        username: string | null;
        password_hash: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

        if (!email) {
            return NextResponse.json(
                { message: "Email is required." },
                { status: 400 }
            );
        }

        if (!password) {
            return NextResponse.json(
                { message: "Password is required." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                {
                    message:
                        "Password must be at least 8 characters.",
                },
                { status: 400 }
            );
        }

        const data =
            await executeGraphQL<GetPendingRegistrationResponse>(
                GET_PENDING_REGISTRATION,
                { email }
            );

        const pendingRegistration =
            data.auth_pending_registrations[0];

        if (!pendingRegistration) {
            return NextResponse.json(
                {
                    message:
                        "Registration session not found.",
                },
                { status: 404 }
            );
        }

        const expiresAt =
            new Date(
                pendingRegistration.expires_at
            ).getTime();

        if (
            Number.isNaN(expiresAt) ||
            Date.now() >= expiresAt
        ) {
            return NextResponse.json(
                {
                    message:
                        "This registration has expired. Please start again.",
                },
                { status: 400 }
            );
        }

        if (!pendingRegistration.email_verified) {
            return NextResponse.json(
                {
                    message:
                        "Please verify your email before setting a password.",
                },
                { status: 403 }
            );
        }

        if (!pendingRegistration.username) {
            return NextResponse.json(
                {
                    message:
                        "Please set your username before creating a password.",
                },
                { status: 400 }
            );
        }

        if (pendingRegistration.password_hash) {
            return NextResponse.json(
                {
                    message:
                        "A password has already been set for this registration.",
                },
                { status: 409 }
            );
        }

        const passwordHash =
            await bcrypt.hash(password, 12);

        await executeGraphQL<UpdatePasswordResponse>(
            UPDATE_PENDING_PASSWORD,
            {
                id: pendingRegistration.id,
                passwordHash,
            }
        );

        return NextResponse.json({
            success: true,
            email: pendingRegistration.email,
        });
    } catch (error) {
        console.error(
            "Register password error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Unable to set password. Please try again.",
            },
            { status: 500 }
        );
    }
}