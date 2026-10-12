import { getCurrentAuth, hasPermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { redirect } from "next/navigation";
import { StudioLayoutClient } from "./StudioLayoutClient";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentAuth();

  if (!auth) {
    if (process.env.NODE_ENV !== "development") {
      redirect("/login");
    }
  } else if (!hasPermission(auth.role, PERMISSIONS.STUDIO_VIEW)) {
    redirect("/unauthorized");
  }

  return <StudioLayoutClient>{children}</StudioLayoutClient>;
}
