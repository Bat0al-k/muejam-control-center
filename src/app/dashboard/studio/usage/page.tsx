import { UsageCard, UsageTable } from "@/components/studio/UsageTable";

export default function UsagePage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
          Analytics &amp; Feature Insights
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Detailed telemetry on GPU compute utilization, latency percentiles, and sub-model load.
        </p>
      </div>

      <UsageCard />
      <UsageTable />
    </div>
  );
}
