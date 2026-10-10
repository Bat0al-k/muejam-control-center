import { ActivityLogTable } from "@/components/studio/ActivityLogTable";
import { UserActivityDrawer } from "@/components/studio/drawers/UserActivityDrawer";

export default function ActivityPage() {
  return (
    <div className=" max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
          Activity Logs
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Historical log ledger of tenant synthesis events, authorization checks, and cluster operations.
        </p>
      </div>

      <ActivityLogTable />

      <UserActivityDrawer />
    </div>
  );
}
