"use client";

import React from "react";
import { StudioHeader } from "./sections/StudioHeader";
import { AlertBanner } from "./sections/AlertBanner";
import { ClusterHealthBar } from "./sections/ClusterHealthBar";
import { KpiGrid } from "./sections/KpiGrid";
import { CreditUsageChart } from "./sections/CreditUsageChart";
import { FeatureUtilization } from "./sections/FeatureUtilization";
import { ActivePipelines } from "./sections/ActivePipelines";
import { RecentActivity } from "./sections/RecentActivity";
import { StudioFooter } from "./sections/StudioFooter";

// Drawers
import { EnvironmentDrawer } from "./drawers/EnvironmentDrawer";
import { AlertsDrawer } from "./drawers/AlertsDrawer";
import { ServiceHealthDrawer } from "./drawers/ServiceHealthDrawer";
import { CreatorsDrawer } from "./drawers/CreatorsDrawer";
import { CreditActivityDrawer } from "./drawers/CreditActivityDrawer";
import { FeatureUtilizationDrawer } from "./drawers/FeatureUtilizationDrawer";
import { PipelineDetailsDrawer } from "./drawers/PipelineDetailsDrawer";
import { GpuUsageDrawer } from "./drawers/GpuUsageDrawer";
import { ModelTrainingDrawer } from "./drawers/ModelTrainingDrawer";
import { InspectWeightsDrawer } from "./drawers/InspectWeightsDrawer";
import { ActivityDetailsDrawer } from "./drawers/ActivityDetailsDrawer";

// Modals
import { AddCreditsModal } from "./modals/AddCreditsModal";
import { ExportModal } from "./modals/ExportModal";
import { CancelPipelineModal } from "./modals/CancelPipelineModal";
import { PauseTrainingModal } from "./modals/PauseTrainingModal";
import { CustomDateRangeModal } from "./modals/CustomDateRangeModal";
import { PipelineOutputModal } from "./modals/PipelineOutputModal";

// Toast
import { ToastContainer } from "./ToastContainer";

export function StudioConsole() {
  return (
    <div className="space-y-5 max-w-[1440px] mx-auto">
      {/* 1. Header (Title, Version Badge, Date Filter, Refresh, Export, Add Credits) */}
      <StudioHeader />

      {/* 2. Attention Required Alert Banner */}
      <AlertBanner />

      {/* 3. Studio Cluster Health Bar */}
      <ClusterHealthBar />

      {/* 4. KPI Cards Grid */}
      <KpiGrid />

      {/* 5. Middle Row: Credit Usage vs Credits Recharged & Feature Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex">
          <div className="w-full">
            <CreditUsageChart />
          </div>
        </div>
        <div className="lg:col-span-5 flex">
          <div className="w-full">
            <FeatureUtilization />
          </div>
        </div>
      </div>

      {/* 6. Active Generative Pipelines & Model Training Infrastructure */}
      <ActivePipelines />

      {/* 7. Recent Studio Activity */}
      <RecentActivity />

      {/* 8. Telemetry Footer */}
      <StudioFooter />

      {/* Drawers */}
      <EnvironmentDrawer />
      <AlertsDrawer />
      <ServiceHealthDrawer />
      <CreatorsDrawer />
      <CreditActivityDrawer />
      <FeatureUtilizationDrawer />
      <PipelineDetailsDrawer />
      <GpuUsageDrawer />
      <ModelTrainingDrawer />
      <InspectWeightsDrawer />
      <ActivityDetailsDrawer />

      {/* Modals */}
      <AddCreditsModal />
      <ExportModal />
      <CancelPipelineModal />
      <PauseTrainingModal />
      <CustomDateRangeModal />
      <PipelineOutputModal />

      {/* Floating Toasts */}
      <ToastContainer />
    </div>
  );
}
