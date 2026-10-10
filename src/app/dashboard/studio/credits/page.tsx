import { CreditBalanceCard } from "@/components/studio/CreditBalanceCard";
import { CreditTransactionTable } from "@/components/studio/CreditTransactionTable";

export default function CreditsPage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
          Enterprise Credits Ledger
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Monitor token provisioning allocations, combustion burn velocity, and corporate tenant wallets.
        </p>
      </div>

      <CreditBalanceCard />
      <CreditTransactionTable />
    </div>
  );
}
