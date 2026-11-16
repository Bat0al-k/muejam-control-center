import { getCurrentAuth, hasPermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { LibraryConsole } from "@/components/library/LibraryConsole";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const auth = await getCurrentAuth();

  if (!auth) {
    redirect("/login");
  }

  if (!hasPermission(auth.role, PERMISSIONS.LIBRARY_VIEW)) {
    redirect("/unauthorized");
  }

  return <LibraryConsole />;
}
