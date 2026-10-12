import { getCurrentAuth, hasPermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { redirect } from "next/navigation";
import { LibraryLayoutClient } from "./LibraryLayoutClient";

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentAuth();

  if (!auth) {
    redirect("/login");
  }

  if (!hasPermission(auth.role, PERMISSIONS.LIBRARY_VIEW)) {
    redirect("/unauthorized");
  }

  return <LibraryLayoutClient>{children}</LibraryLayoutClient>;
}
