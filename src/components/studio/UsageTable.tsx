"use client";

import React from "react";
import { useStudio } from "@/features/studio/context";
import { FiTrendingUp, FiCheckCircle } from "react-icons/fi";

export function UsageCard() {
  const { featureUtilization } = useStudio();

  const totalCredits = featureUtilization.reduce((sum, f) => sum + f.credits, 0);
  const totalGenerations = featureUtilization.reduce((sum, f) => sum + f.generationsCount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
          Total Model Generations
        </span>
        <div className="text-3xl font-extrabold font-syne text-[#111111]">
          {totalGenerations.toLocaleString()}
        </div>
        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-2">
          <FiTrendingUp className="w-3.5 h-3.5" />
          +18.4% synthesis volume
        </span>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
          Total Credits Combustion
        </span>
        <div className="text-3xl font-extrabold font-syne text-[#111111]">
          {totalCredits.toLocaleString()}
        </div>
        <span className="text-xs text-[#6B7280] mt-2 block">
          30-day rolling aggregate
        </span>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
          Mean Latency Across Nodes
        </span>
        <div className="text-3xl font-extrabold font-syne text-[#111111]">
          2.4s
        </div>
        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-2">
          <FiCheckCircle className="w-3.5 h-3.5" />
          P95 latency inside SLA bound
        </span>
      </div>
    </div>
  );
}

export function UsageTable() {
  const { featureUtilization, openDrawer } = useStudio();

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
      <div className="p-5 border-b border-[#F0F0F2] bg-[#FAFAFB]">
        <h3 className="font-bold font-syne text-[#111111] text-sm">
          Feature Utilization Breakdown
        </h3>
        <p className="text-xs text-[#6B7280]">
          Combustion breakdown and sub-model performance metrics
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F0F0F2] bg-[#FAFAFB] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
              <th className="py-3 px-4">Feature Category</th>
              <th className="py-3 px-4">Share (%)</th>
              <th className="py-3 px-4 text-right">Credits Consumed</th>
              <th className="py-3 px-4 text-right">Job Count</th>
              <th className="py-3 px-4">Success Rate</th>
              <th className="py-3 px-4">Avg Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F2] text-[#374151]">
            {featureUtilization.map((f) => (
              <tr
                key={f.id}
                onClick={() => openDrawer({ type: "featureUtilization", featureId: f.id })}
                className="hover:bg-[#FFF5F2] cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-bold text-[#111111]">
                  {f.name}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{f.percentage}%</span>
                    <div className="w-16 bg-[#F3F4F6] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${f.percentage}%`, backgroundColor: f.color }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-right text-[#111111]">
                  {f.credits.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-mono text-right text-[#6B7280]">
                  {f.generationsCount.toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-emerald-700 font-semibold">{f.successRate}%</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[#6B7280]">
                  {f.avgProcessingTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
