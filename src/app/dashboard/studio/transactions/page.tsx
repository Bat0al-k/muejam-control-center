import { CreditTransactionTable } from "@/components/studio/CreditTransactionTable";

export default function TransactionsPage() {
  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold font-syne text-[#111111] tracking-tight">
          System Transactions
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Cryptographically verified audit trail of all token deductions, recurring auto-recharges, and admin injections.
        </p>
      </div>

      <CreditTransactionTable />
    </div>
  );
}
