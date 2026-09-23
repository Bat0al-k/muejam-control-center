export async function getUsers() {
    const res = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || "",
        },
        body: JSON.stringify({
            query: `
                query GetUsers {
                    auth_users {
                        id
                        display_name
                        email
                        created_at
                        disabled
                        password_hash
                        email_verified
                        role {
                            role
                        }
                    }
                }
            `,
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }

    const { data } = await res.json();
    return data?.auth_users || [];
}


// _______________________ GraphQL Response _______________________ 

interface GraphQLResponse<T> {
    data?: T;
    errors?: Array<{
        message: string;
    }>;
}


// _______________________ Execute GraphQL _______________________ 

export async function executeGraphQL<T>(
    query: string,
    variables?: Record<string, unknown>
): Promise<T> {
    const url = process.env.HASURA_GRAPHQL_URL;
    const adminSecret = process.env.HASURA_ADMIN_SECRET;

    if (!url) {
        throw new Error("HASURA_GRAPHQL_URL is not configured.");
    }

    if (!adminSecret) {
        throw new Error("HASURA_ADMIN_SECRET is not configured.");
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": adminSecret,
        },
        body: JSON.stringify({
            query,
            variables,
        }),
        cache: "no-store",
    });

    const result = (await response.json()) as GraphQLResponse<T>;

    if (!response.ok) {
        throw new Error(
            result.errors?.[0]?.message || "GraphQL request failed."
        );
    }

    if (result.errors?.length) {
        throw new Error(result.errors[0].message);
    }

    if (!result.data) {
        throw new Error("GraphQL response contains no data.");
    }

    return result.data;
}