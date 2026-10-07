import { requireAuth } from "@/lib/server-auth";

export default async function LibraryPage() {
  await requireAuth();

  return (
    <main>
      <h1>LibraryPage</h1>
    </main>
  );
}