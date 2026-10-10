import { requirePermission } from "@/lib/server-auth";
import { PERMISSIONS } from "@/features/auth/permissions";
import { StudioConsole } from "@/components/studio/StudioConsole";

export default async function StudioPage() {
  try {
    await requirePermission(PERMISSIONS.STUDIO_VIEW);
  } catch (err) {
    // In dev mode allow direct preview if token cookie is not present
    if (process.env.NODE_ENV !== "development") {
      throw err;
    }
  }

  return <StudioConsole />;
}