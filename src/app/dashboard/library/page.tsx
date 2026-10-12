import { getCurrentAuth, hasPermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const auth = await getCurrentAuth();

  if (!auth) {
    if (process.env.NODE_ENV !== "development") {
      redirect("/login");
    }
  } else if (!hasPermission(auth.role, PERMISSIONS.LIBRARY_VIEW)) {
    redirect("/unauthorized");
  }

  return (
    <main>
      <h1>LibraryPage</h1>
    </main>
  );
}