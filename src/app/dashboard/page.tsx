import { redirect } from "next/navigation";
import { getCurrentAuth } from "@/lib/server-auth";
import { USER_ROLES } from "@/features/auth/roles";

export default async function DashboardPage() {
    const auth = await getCurrentAuth();

    if (!auth) {
        redirect("/login");
    }

    // Developer has access to everything (Studio & Library), defaults to Studio console
    if (auth.role === USER_ROLES.DEVELOPER) {
        redirect("/dashboard/studio");
    }

    // Admin (Sub-admin) and Author can only access the Library
    redirect("/dashboard/library");
}
