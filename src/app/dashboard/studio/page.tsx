import { requirePermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";

export default async function StudioPage() {
  await requirePermission(PERMISSIONS.STUDIO_VIEW);

  return (
    <main>
      <h1>StudioPage</h1>
    </main>
  );
}