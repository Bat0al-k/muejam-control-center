import { redirect } from "next/navigation";
import { getCurrentAuth } from "@/lib/server-auth";
import { getUsers } from "@/graphql/client";

export default async function DashboardPage() {
    const auth = await getCurrentAuth();

    if (!auth) {
        redirect("/login");
    }

    const users = await getUsers();

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Dashboard Overview</h1>
            <p>Welcome to your dashboard, {users[1].display_name}!</p>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "2rem",
                }}
            >
                <thead>
                    <tr
                        style={{
                            borderBottom: "1px solid #ddd",
                            backgroundColor: "#f5f5f5",
                        }}
                    >
                        <th
                            style={{
                                padding: "0.5rem",
                                textAlign: "left",
                            }}
                        >
                            Name
                        </th>

                        <th
                            style={{
                                padding: "0.5rem",
                                textAlign: "left",
                            }}
                        >
                            Email
                        </th>

                        <th
                            style={{
                                padding: "0.5rem",
                                textAlign: "left",
                            }}
                        >
                            Email Verified
                        </th>

                        <th
                            style={{
                                padding: "0.5rem",
                                textAlign: "left",
                            }}
                        >
                            Created At
                        </th>

                        {/* <th style={{ padding: "0.5rem", textAlign: "left" }}>
                            Password Hash
                        </th> */}

                        <th
                            style={{
                                padding: "0.5rem",
                                textAlign: "left",
                            }}
                        >
                            Disabled
                        </th>

                        <th
                            style={{
                                padding: "0.5rem",
                                textAlign: "left",
                            }}
                        >
                            Role
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user: any) => (
                        <tr
                            key={user.id}
                            style={{
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            <td style={{ padding: "0.5rem" }}>
                                {user.display_name || "Unknown User"}
                            </td>

                            <td style={{ padding: "0.5rem" }}>
                                {user.email}
                            </td>

                            <td style={{ padding: "0.5rem" }}>
                                {String(user.email_verified)}
                            </td>

                            <td style={{ padding: "0.5rem" }}>
                                {new Date(
                                    user.created_at
                                ).toLocaleString()}
                            </td>

                            {/* <td style={{ padding: "0.5rem" }}>
                                {user.password_hash}
                            </td> */}

                            <td style={{ padding: "0.5rem" }}>
                                {String(user.disabled)}
                            </td>

                            <td style={{ padding: "0.5rem" }}>
                                {user.role?.role}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
