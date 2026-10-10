"use client";

import React, { useState } from "react";
import { useStudio } from "@/features/studio/context";
import { ChartDataPoint } from "@/features/studio/types";
import { FiActivity, FiInfo } from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  createHorizontalChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function CreditUsageChart() {
  const { chartData, peakVolumeInfo, openDrawer } = useStudio();
  // const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    point: ChartDataPoint;
    x: number;
    y: number;
  } | null>(null);
  const Typed = createHorizontalChart<
    (typeof chartData)[number],
    string,
    number
  >()({
    Area,
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
  });

  const handlePointClick = (point: ChartDataPoint) => {
    openDrawer({ type: "creditActivity", point });
  };

  const handlePeakCalloutClick = () => {
    const peakPoint =
      chartData.find((d) => d.peak) || chartData[chartData.length - 3] || chartData[0];
    openDrawer({ type: "creditActivity", point: peakPoint });
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
      {/* Header & Legend */}
      <div className="space-y-3">
        <div className="flex w-full flex-row sm:flex-col sm:items-start sm:justify-between gap-3">
          <div>
            <div className="w-full flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-[#E8785A]" />
              <h3 className="text-xl font-bold font-syne text-[#111111] tracking-tight">
                Credit Usage vs Credits Recharged
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Daily token combustion versus pool recharge volume (30-day cumulative window)
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#111111]" />
              <span className="text-[#374151] font-medium">Credits Used</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E8785A]" />
              <span className="text-[#374151] font-medium">Credits Recharged</span>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#006A61]/15 text-[#065F46] border border-[#c3d5cc]">
              Peak: 182k/day
            </span>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative ">
          {/* Custom Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute z-20 pointer-events-none bg-[#111111] text-white p-2.5 rounded-xl text-xs shadow-xl space-y-1"
              style={{
                left: `${hoveredPoint.x}px`,
                top: `${hoveredPoint.y}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="font-bold text-[11px] text-[#A3A3A3] pb-1 border-b border-white/10 flex justify-between gap-3">
                <span>{hoveredPoint.point.date}</span>

                <span className="text-amber-400 font-mono">
                  {hoveredPoint.point.day}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[11px]">
                <span className="text-slate-300">
                  Credits Used:
                </span>

                <span className="font-mono font-bold text-white">
                  {hoveredPoint.point.used.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[11px]">
                <span className="text-[#E8785A]">
                  Recharged:
                </span>

                <span className="font-mono font-bold text-[#E8785A]">
                  {hoveredPoint.point.recharged.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-[10px] text-emerald-400 pt-0.5 border-t border-white/10">
                <span>Net Change:</span>

                <span className="font-mono font-bold">
                  +{hoveredPoint.point.difference.toLocaleString()}
                </span>
              </div>

              <div className="text-[9px] text-[#9CA3AF] text-center pt-0.5">
                Click to inspect date ledger
              </div>
            </div>
          )}

          {/* New Recharts Area Chart */}
          <Typed.AreaChart
            style={{
              width: "100%",
              maxWidth: "700px",
              maxHeight: "45vh",
              aspectRatio: 1.618,
            }}
            responsive
            data={chartData}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onMouseMove={(state) => {
              if (
                state?.activeTooltipIndex !== undefined &&
                state.activeTooltipIndex !== null
              ) {
                const point =
                  chartData[Number(state.activeTooltipIndex)];

                if (point) {
                  // setHoveredPoint(point);
                  if (point && state.activeCoordinate) {
                    setHoveredPoint({
                      point,
                      x: state.activeCoordinate.x,
                      y: state.activeCoordinate.y,
                    });
                  }
                }
              }
            }}
            onMouseLeave={() => {
              setHoveredPoint(null);
            }}
            onClick={(state) => {
              if (
                state?.activeTooltipIndex !== undefined &&
                state.activeTooltipIndex !== null
              ) {
                const point =
                  chartData[Number(state.activeTooltipIndex)];

                if (point) {
                  handlePointClick(point);
                }
              }
            }}
          >
            <defs>
              {/* Orange Gradient */}
              <linearGradient
                id="orangeAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="10%"
                  stopColor="#E8785A"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="#E8785A"
                  stopOpacity={0}
                />
              </linearGradient>

              {/* Black Gradient */}
              <linearGradient
                id="blackAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="70%"
                  stopColor="#111111"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#111111"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid
              stroke="#F3F4F6"
              strokeDasharray="4 4"
            />

            {/* X Axis */}
            <Typed.XAxis
              dataKey="day"
              tick={{
                fill: "#9CA3AF",
                fontSize: 11,
                fontFamily: "monospace",
              }}
              ticks={chartData
                .filter((d) =>
                  // Day 01   Day 07   Day 13   Day 19   Day 25   Day 30
                  ["Day 01", "Day 06", "Day 12", "Day 18", "Day 24", "Day 30 (Today)"].includes(
                    d.day
                  )
                )
                .map((d) => d.day)}
              interval={0}
              axisLine={{ stroke: "#F0F0F2" }}
              tickLine={false}
            />

            {/* Y Axis */}
            <Typed.YAxis
              width="auto"
              tick={{
                fill: "#9CA3AF",
                fontSize: 10,
                fontFamily: "monospace",
              }}
              axisLine={false}
              tickLine={false}
              domain={[0, "auto"]}
              tickFormatter={(value) =>
                value >= 1000
                  ? `${value / 1000}k`
                  : value
              }
            />

            {/* Recharts Tooltip disabled visually */}
            <Tooltip
              content={() => null}
              cursor={{
                stroke: "#E8785A",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            {/* ORANGE — Recharged */}
            <Typed.Area
              type="monotone"
              dataKey="recharged"
              stroke="#E8785A"
              strokeWidth={2.5}
              activeDot={{
                r: 5,
                fill: "#FFFFFF",
                stroke: "#E8785A",
                strokeWidth: 2,
              }}
              fillOpacity={1}
              fill="url(#orangeAreaGradient)"
              isAnimationActive
              animationBegin={200}
              animationDuration={1300}
              dot={(props) => {
                const { cx, cy, index } = props;
                const point = chartData[index];

                if (!point) return null;

                const isHovered =
                  hoveredPoint?.point.day === point.day;

                return (
                  // <circle
                  //   cx={cx}
                  //   cy={cy}
                  //   r={isHovered ? 5 : 3.5}
                  //   fill="#FFFFFF"
                  //   stroke="#E8785A"
                  //   strokeWidth={2}
                  // />
                  <g>
                    {/* Peak Marker */}
                    {point.peak && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 5 : 3.5}
                        fill="#ffffff"
                        stroke="#E8785A"
                        strokeWidth={2}
                      />
                    )}
                  </g>
                );
              }}
            />

            {/* BLACK — Used */}
            <Typed.Area
              type="monotone"
              dataKey="used"
              stroke="#111111"
              strokeWidth={2.5}
              activeDot={{
                r: 5,
                fill: "#FFFFFF",
                stroke: "#111111",
                strokeWidth: 2,
              }}
              fillOpacity={0.12}
              fill="url(#blackAreaGradient)"
              isAnimationActive
              animationBegin={200}
              animationDuration={1300}
              dot={(props) => {
                const { cx, cy, index } = props;
                const point = chartData[index];

                if (!point) return null;

                const isHovered =
                  hoveredPoint?.point.day === point.day;

                return (
                  <g>
                    {/* Peak Marker */}
                    {point.peak && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 5 : 3.5}
                        fill="#ffffff"
                        stroke="#111111"
                        strokeWidth={2}
                      />
                    )}

                    {/* Used Dot */}
                    {/* <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 5 : 3.5}
                      fill="#FFFFFF"
                      stroke="#111111"
                      strokeWidth={2}
                    /> */}
                  </g>
                );
              }}
            />
          </Typed.AreaChart>

          {/* Bottom Labels — if you want EXACT old labels */}
          {/* <div className="flex justify-between px-3 text-[11px] text-[#9CA3AF] font-mono border-t border-[#F0F0F2] pt-2">
            <span>Day 01</span>
            <span>Day 06</span>
            <span>Day 12</span>
            <span>Day 18</span>
            <span>Day 24</span>
            <span className="font-semibold text-[#111111]">
              Day 30 (Today)
            </span>
          </div> */}
        </div>

      </div>

      {/* Callout Card (Clickable to Day 27 drilldown) */}
      <button
        onClick={handlePeakCalloutClick}
        className="group w-full mt-4 p-3.5 bg-[#006A61]/15 hover:bg-[#006A61]/20 border border-[#006A61]/15 rounded-xl flex flex-row sm:flex-col sm:items-start justify-between text-left gap-2 text-xs transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 text-[#166534]">
          <FiInfo className="w-4 h-4 text-[#B32700] shrink-0" />
          <span>
            Peak daily volume observed on <strong>{peakVolumeInfo.day}</strong> with{" "}
            <strong>{peakVolumeInfo.credits.toLocaleString()} credits</strong> deployed in synthesis.
          </span>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[#15803D] font-bold">
            Net Recharge Velocity:{" "}
            <span className="text-[#B32700] font-extrabold">
              {peakVolumeInfo.netVelocity}
            </span>
          </span>
        </div>
      </button>
    </div>
  );
}


{/* Chart Canvas Area svg drawn with Recharts */ }
// <div className="relative pt-2">
//   {/* Tooltip Hover Overlay */}
//   {hoveredPoint && (
//     <div
//       className="absolute z-20 pointer-events-none bg-[#111111] text-white p-2.5 rounded-xl text-xs shadow-xl space-y-1"
//       style={{
//         left: `${(chartData.indexOf(hoveredPoint) / (chartData.length - 1)) * 92 + 4}%`,
//         top: "15%",
//       }}
//     >
//       <div className="font-bold text-[11px] text-[#A3A3A3] pb-1 border-b border-white/10 flex justify-between gap-3">
//         <span>{hoveredPoint.date}</span>
//         <span className="text-amber-400 font-mono">{hoveredPoint.day}</span>
//       </div>
//       <div className="flex justify-between gap-4 text-[11px]">
//         <span className="text-slate-300">Credits Used:</span>
//         <span className="font-mono font-bold text-white">
//           {hoveredPoint.used.toLocaleString()}
//         </span>
//       </div>
//       <div className="flex justify-between gap-4 text-[11px]">
//         <span className="text-[#E8785A]">Recharged:</span>
//         <span className="font-mono font-bold text-[#E8785A]">
//           {hoveredPoint.recharged.toLocaleString()}
//         </span>
//       </div>
//       <div className="flex justify-between gap-4 text-[10px] text-emerald-400 pt-0.5 border-t border-white/10">
//         <span>Net Change:</span>
//         <span className="font-mono font-bold">
//           +{hoveredPoint.difference.toLocaleString()}
//         </span>
//       </div>
//       <div className="text-[9px] text-[#9CA3AF] text-center pt-0.5">
//         Click to inspect date ledger
//       </div>
//     </div>
//   )}

//   {/* SVG Line / Area Graph */}
//   <div className="w-full overflow-hidden">
//     <svg
//       viewBox={`0 0 ${svgWidth} ${svgHeight}`}
//       className="w-full h-48 sm:h-56"
//     >
//       <defs>
//         {/* Coral Area Gradient */}
//         <linearGradient id="coralAreaGrad" x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor="#E8785A" stopOpacity="0.22" />
//           <stop offset="100%" stopColor="#E8785A" stopOpacity="0.01" />
//         </linearGradient>
//       </defs>

//       {/* Grid Guide Lines */}
//       <line
//         x1={paddingX}
//         y1={getY(50000)}
//         x2={svgWidth - paddingX}
//         y2={getY(50000)}
//         stroke="#F3F4F6"
//         strokeDasharray="4 4"
//       />
//       <line
//         x1={paddingX}
//         y1={getY(100000)}
//         x2={svgWidth - paddingX}
//         y2={getY(100000)}
//         stroke="#F3F4F6"
//         strokeDasharray="4 4"
//       />
//       <line
//         x1={paddingX}
//         y1={getY(150000)}
//         x2={svgWidth - paddingX}
//         y2={getY(150000)}
//         stroke="#F3F4F6"
//         strokeDasharray="4 4"
//       />

//       {/* Recharged Area Fill */}
//       <path d={areaPathRecharged} fill="url(#coralAreaGrad)" />

//       {/* Recharged Line (Coral) */}
//       <path
//         d={linePathRecharged}
//         fill="none"
//         stroke="#E8785A"
//         strokeWidth="2.5"
//         strokeLinecap="round"
//       />

//       {/* Used Line (Dark/Black) */}
//       <path
//         d={linePathUsed}
//         fill="none"
//         stroke="#1E293B"
//         strokeWidth="2.5"
//         strokeLinecap="round"
//       />

//       {/* Interactive Data Point Dots */}
//       {chartData.map((d, idx) => {
//         const cx = getX(idx);
//         const cyRecharged = getY(d.recharged);
//         const cyUsed = getY(d.used);
//         const isHovered = hoveredPoint?.day === d.day;

//         return (
//           <g
//             key={d.day}
//             className="cursor-pointer"
//             onMouseEnter={() => setHoveredPoint(d)}
//             onMouseLeave={() => setHoveredPoint(null)}
//             onClick={() => handlePointClick(d)}
//           >
//             {/* Peak Marker Ring */}
//             {d.peak && (
//               <circle
//                 cx={cx}
//                 cy={cyUsed}
//                 r={isHovered ? "5" : "3.5"}
//                 fill="#FFFFFF"
//                 stroke="#111111"
//                 strokeWidth="2"
//               // strokeDasharray="2 2"
//               />
//             )}
//             {d.peak && (
//               <circle
//                 cx={cx}
//                 cy={cyRecharged}
//                 r={isHovered ? "5" : "3.5"}
//                 fill="#FFFFFF"
//                 stroke="#E8785A"
//                 strokeWidth="2"
//               // strokeDasharray="2 2"
//               />
//             )}

//             {/* Recharged Dot */}
//             {/* <circle
//               cx={cx}
//               cy={cyRecharged}
//               r={isHovered ? "5" : "3.5"}
//               fill="#FFFFFF"
//               stroke="#E8785A"
//               strokeWidth="2"
//               className="transition-all"
//             /> */}

//             {/* Used Dot */}
//             {/* <circle
//               cx={cx}
//               cy={cyUsed}
//               r={isHovered ? "5" : "3.5"}
//               fill="#FFFFFF"
//               stroke="#111111"
//               strokeWidth="2"
//               className="transition-all"
//             /> */}
//           </g>
//         );
//       })}
//     </svg>
//   </div>

//   {/* X Axis Labels */}
//   <div className="flex justify-between px-3 text-[11px] text-[#9CA3AF] font-mono border-t border-[#F0F0F2] pt-2">
//     <span>Day 01</span>
//     <span>Day 06</span>
//     <span>Day 12</span>
//     <span>Day 18</span>
//     <span>Day 24</span>
//     <span className="font-semibold text-[#111111]">Day 30 (Today)</span>
//   </div>
// </div>