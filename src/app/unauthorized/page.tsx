import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <main style={{ padding: "2rem" }}>
            <h1>Unauthorized</h1>

            <p>
                You do not have permission to access this page.
            </p>

            <Link href="/dashboard">
                Back to dashboard
            </Link>
        </main>
    );
}