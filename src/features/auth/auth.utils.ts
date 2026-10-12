/**
 * Perform client-side and server-side logout:
 * - Calls `/api/auth/logout` to clear HttpOnly session cookies.
 * - Clears client-side localStorage.
 * - Hard navigates to `/login` to reset all in-memory React/Next.js cache state.
 */
export async function logout(): Promise<void> {
    try {
        await fetch("/api/auth/logout", {
            method: "POST",
        });
    } catch (error) {
        console.error("Logout request failed:", error);
    } finally {
        if (typeof window !== "undefined") {
            try {
                localStorage.removeItem("user");
                sessionStorage.clear();
            } catch {
                // Ignore storage access errors in restricted environments
            }
            window.location.replace("/login");
        }
    }
}
