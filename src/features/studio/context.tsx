"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  ReactNode,
} from "react";
import {
  ActiveDrawerType,
  ActiveModalType,
  ActivePipeline,
  ChartDataPoint,
  DateRangeOption,
  EventTypeFilter,
  FeatureUtilizationData,
  StudioFeatureUsage,
  GpuResourceUsage,
  ModelTrainingInfo,
  ServiceHealth,
  StudioActivity,
  StudioAlert,
  ToastMessage,
} from "./types";
import {
  initialAlerts,
  initialChartData30Days,
  initialChartData7Days,
  initialClusterHealth,
  initialFeatureUtilization,
  initialGpuUsage,
  initialModelTraining,
  // initialRecentActivity,
  initialActivePipelines,
} from "./mock-data";
import { StudioPaymentActivity } from "./studio.types";

interface KpiStats {
  activeCreators: number;
  creatorsTrend: string;
  creditsAdded: number;
  creditsAddedTrend: string;
  creditsConsumed: number;
  creditsConsumedTrend: string;
  totalTransactions: number;
  transactionsTrend: string;
}

interface StudioContextType {
  activityStatus: "loading" | "live" | "error";
  // Filters
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
  customRange: { start: string; end: string };
  setCustomRange: (range: { start: string; end: string }) => void;
  eventTypeFilter: EventTypeFilter;
  setEventTypeFilter: (filter: EventTypeFilter) => void;

  // Refresh
  isRefreshing: boolean;
  lastUpdated: string;
  clusterLatency: number;
  refreshDashboard: () => Promise<void>;

  // Data & KPIs
  kpiStats: KpiStats;
  chartData: ChartDataPoint[];
  peakVolumeInfo: { day: string; credits: number; netVelocity: string };
  featureUtilization: FeatureUtilizationData[];
  featureUsage: StudioFeatureUsage | null;
  featureUsageStatus: "loading" | "live" | "error";
  clusterHealth: ServiceHealth[];
  alerts: StudioAlert[];
  activePipelines: ActivePipeline[];
  recentActivity: StudioActivity[];
  filteredActivity: StudioActivity[];
  modelTraining: ModelTrainingInfo;
  gpuUsage: GpuResourceUsage;

  // Operations
  addEnterpriseCredits: (params: {
    account: string;
    amount: number;
    reason?: string;
    notes?: string;
  }) => Promise<void>;
  cancelPipeline: (pipelineId: string) => void;
  retryPipeline: (pipelineId: string) => void;
  toggleTrainingPause: () => void;
  exportData: (params: { scope: string; format: "csv" | "json" }) => Promise<void>;

  // Drawers & Modals
  activeDrawer: ActiveDrawerType;
  openDrawer: (drawer: ActiveDrawerType) => void;
  closeDrawer: () => void;
  activeModal: ActiveModalType;
  openModal: (modal: ActiveModalType) => void;
  closeModal: () => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (type: "success" | "error" | "info", message: string, title?: string) => void;
  dismissToast: (id: string) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);
async function fetchRecentActivity(): Promise<StudioActivity[]> {
  const response = await fetch("/api/studio/activity", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Studio activity");
  }

  const data: { activity?: StudioActivity[] } = await response.json();

  return Array.isArray(data.activity) ? data.activity : [];
}
export function StudioProvider({ children }: { children: ReactNode }) {
  // Filter States
  const [dateRange, setDateRange] = useState<DateRangeOption>("30d");
  const [customRange, setCustomRange] = useState({ start: "2026-09-07", end: "2026-10-07" });
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>("All Events");

  // Dynamic Data States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [clusterLatency,] = useState(14);
  const [additionalCreditsAdded, setAdditionalCreditsAdded] = useState(0);

  const [activePipelines, setActivePipelines] = useState<ActivePipeline[]>(initialActivePipelines);
  // const [recentActivity, setRecentActivity] = useState<StudioActivity[]>(initialRecentActivity);
  // const [realRecentActivity, setRealRecentActivity] = useState<StudioActivity[]>([]);
  const [recentActivity, setRecentActivity] =
    useState<StudioActivity[]>([]);

  const [activityStatus, setActivityStatus] =
    useState<"loading" | "live" | "error">("loading");

  const [modelTraining, setModelTraining] = useState<ModelTrainingInfo>(initialModelTraining);
  const [clusterHealth] = useState<ServiceHealth[]>(initialClusterHealth);
  const [alerts] = useState<StudioAlert[]>(initialAlerts);
  const [gpuUsage] = useState<GpuResourceUsage>(initialGpuUsage);

  // Drawer & Modal States
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawerType>(null);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [dynamicKpis, setDynamicKpis] = useState({
    activeCreators: 0,
    totalTransactions: 0,
  });

  // const [liveFeatureUsage, setLiveFeatureUsage] = useState<{
  //   aiTextCount: number;
  //   voiceGenerationCount: number;
  //   videoCount: number;
  //   imageCount: number;
  // } | null>(null);

  const [featureUsage, setFeatureUsage] =
    useState<StudioFeatureUsage | null>(null);

  const [featureUsageStatus, setFeatureUsageStatus] =
    useState<"loading" | "live" | "error">("loading");

  const [, setPaymentActivity] = useState<
    StudioPaymentActivity[]
  >([]);

  const [, setIsLoadingOverview] = useState(false);

  // Toast helper
  const showToast = (type: "success" | "error" | "info", message: string, title?: string) => {
    const id = "toast-" + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        setIsLoadingOverview(true);

        const params = new URLSearchParams({
          range: dateRange,
        });

        if (dateRange === "custom") {
          params.set("start", customRange.start);
          params.set("end", customRange.end);
        }

        const response = await fetch(
          `/api/studio/overview?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Studio overview");
        }

        const data = await response.json();

        if (!cancelled) {
          setDynamicKpis(data.kpis);
          setPaymentActivity(data.payments);
        }
      } catch (error) {
        console.error(
          "Failed to load Studio overview:",
          error
        );
      } finally {
        if (!cancelled) {
          setIsLoadingOverview(false);
        }
      }
    }

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, [dateRange, customRange]);

  // useEffect(() => {
  //   let cancelled = false;

  //   async function loadRecentActivity() {
  //     try {
  //       const response = await fetch("/api/studio/activity", {
  //         method: "GET",
  //         cache: "no-store",
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch Studio activity");
  //       }

  //       const data = await response.json();

  //       if (!cancelled) {
  //         setRealRecentActivity(data.activity ?? []);
  //       }
  //     } catch (error) {
  //       console.error(
  //         "Failed to load Studio activity:",
  //         error
  //       );
  //     }
  //   }

  //   loadRecentActivity();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentActivity() {
      setActivityStatus("loading");

      try {
        const activity = await fetchRecentActivity();

        if (!cancelled) {
          setRecentActivity(activity);
          setActivityStatus("live");
        }
      } catch (error) {
        console.error("Failed to load Studio activity:", error);

        if (!cancelled) {
          setRecentActivity([]);
          setActivityStatus("error");
        }
      }
    }

    loadRecentActivity();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatureUtilization() {
      try {
        // Prevent showing data from the previous date range.
        // setLiveFeatureUsage(null);
        setFeatureUsage(null);
        setFeatureUsageStatus("loading");

        const now = new Date();
        let start: Date;
        let end: Date;

        if (dateRange === "custom") {
          if (!customRange.start || !customRange.end) {
            throw new Error("Please select both start and end dates.");
          }

          start = new Date(`${customRange.start}T00:00:00`);
          end = new Date(`${customRange.end}T00:00:00`);

          if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            start > end
          ) {
            throw new Error("Invalid custom date range.");
          }

          // Include the selected end date in the results.
          end.setDate(end.getDate() + 1);
        } else if (dateRange === "7d") {
          end = now;
          start = new Date(now);
          start.setDate(start.getDate() - 7);
        } else if (dateRange === "this_month") {
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = now;
        } else if (dateRange === "prev_month") {
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          end = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
          // Default: last 30 days.
          end = now;
          start = new Date(now);
          start.setDate(start.getDate() - 30);
        }

        const params = new URLSearchParams({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        });

        const response = await fetch(
          `/api/studio/feature-utilization?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Studio feature utilization");
        }

        // const data: {
        //   usage: {
        //     aiTextCount: number;
        //     voiceGenerationCount: number;
        //     videoCount: number;
        //     imageCount: number;
        //   };
        //   dataSource: "live";
        // } = await response.json();

        const data: {
          usage: StudioFeatureUsage;
          dataSource: "live";
        } = await response.json();

        if (!cancelled) {
          // setLiveFeatureUsage(data.usage);
          setFeatureUsage(data.usage);
          setFeatureUsageStatus("live");
        }
      } catch (error) {
        console.error("Failed to load Studio feature utilization:", error);

        if (!cancelled) {
          // setLiveFeatureUsage(null);
          setFeatureUsage(null);
          setFeatureUsageStatus("error");
        }
      }
    }

    loadFeatureUtilization();

    return () => {
      cancelled = true;
    };
  }, [dateRange, customRange]);

  // KPI Calculations responsive to date range
  const kpiStats: KpiStats = useMemo(() => {
    switch (dateRange) {
      case "7d":
        return {
          activeCreators: dynamicKpis.activeCreators,
          creatorsTrend: "+8.4%",
          creditsAdded: 31500 + additionalCreditsAdded,
          creditsAddedTrend: "+12.6%",
          creditsConsumed: 22400,
          creditsConsumedTrend: "+9.1%",
          totalTransactions: dynamicKpis.totalTransactions,
          transactionsTrend: "+18.2%",
        };
      case "this_month":
        return {
          activeCreators: dynamicKpis.activeCreators,
          creatorsTrend: "+14.0%",
          creditsAdded: 78200 + additionalCreditsAdded,
          creditsAddedTrend: "+21.5%",
          creditsConsumed: 57400,
          creditsConsumedTrend: "+17.2%",
          totalTransactions: dynamicKpis.totalTransactions,
          transactionsTrend: "+30.4%",
        };
      case "prev_month":
        return {
          activeCreators: dynamicKpis.activeCreators,
          creatorsTrend: "+10.2%",
          creditsAdded: 68800,
          creditsAddedTrend: "+18.3%",
          creditsConsumed: 51900,
          creditsConsumedTrend: "+14.5%",
          totalTransactions: dynamicKpis.totalTransactions,
          transactionsTrend: "+22.1%",
        };
      case "custom":
        return {
          activeCreators: dynamicKpis.activeCreators,
          creatorsTrend: "+11.1%",
          creditsAdded: 54000 + additionalCreditsAdded,
          creditsAddedTrend: "+16.8%",
          creditsConsumed: 41200,
          creditsConsumedTrend: "+13.4%",
          totalTransactions: dynamicKpis.totalTransactions,
          transactionsTrend: "+24.5%",
        };
      case "30d":
      default:
        return {
          activeCreators: dynamicKpis.activeCreators,
          creatorsTrend: "+15.2%",
          creditsAdded: 85400 + additionalCreditsAdded,
          creditsAddedTrend: "+24.1%",
          creditsConsumed: 62180,
          creditsConsumedTrend: "+19.8%",
          totalTransactions: dynamicKpis.totalTransactions,
          transactionsTrend: "+34.0%",
        };
    }
  }, [dateRange, additionalCreditsAdded, dynamicKpis]);

  // Chart Data responsive to date range
  const chartData = useMemo(() => {
    if (dateRange === "7d") {
      return initialChartData7Days;
    }
    return initialChartData30Days;
  }, [dateRange]);

  const peakVolumeInfo = useMemo(() => {
    if (dateRange === "7d") {
      return { day: "Day 04", credits: 182410, netVelocity: "+412K" };
    }
    return { day: "Day 27", credits: 182410, netVelocity: "+1.43M" };
  }, [dateRange]);

  // Feature utilization responsive to date range
  // const featureUtilization = useMemo(() => {
  //   const multiplier = dateRange === "7d" ? 0.32 : dateRange === "this_month" ? 0.9 : 1.0;
  //   return initialFeatureUtilization.map((f) => ({
  //     ...f,
  //     credits: Math.round(f.credits * multiplier),
  //     generationsCount: Math.round(f.generationsCount * multiplier),
  //   }));
  // }, [dateRange]);

  // const featureUtilization = useMemo(() => {
  //   const multiplier =
  //     dateRange === "7d" ? 0.32 : dateRange === "this_month" ? 0.9 : 1.0;

  //   return initialFeatureUtilization.map((feature) => {
  //     const baseFeature = {
  //       ...feature,
  //       credits: Math.round(feature.credits * multiplier),
  //       generationsCount: Math.round(
  //         feature.generationsCount * multiplier,
  //       ),
  //       dataSource: "mock" as const,
  //     };

  //     if (!liveFeatureUsage) {
  //       return baseFeature;
  //     }

  //     if (feature.id === "ai-text") {
  //       return {
  //         ...baseFeature,
  //         generationsCount: liveFeatureUsage.aiTextCount,
  //         dataSource: "live" as const,
  //       };
  //     }

  //     if (feature.id === "voice-speech") {
  //       return {
  //         ...baseFeature,
  //         generationsCount: liveFeatureUsage.voiceGenerationCount,
  //         dataSource: "live" as const,
  //       };
  //     }

  //     if (feature.id === "video-gen") {
  //       return {
  //         ...baseFeature,
  //         generationsCount: liveFeatureUsage.videoCount,
  //         dataSource: "live" as const,
  //       };
  //     }

  //     if (feature.id === "image-gen") {
  //       return {
  //         ...baseFeature,
  //         generationsCount: liveFeatureUsage.imageCount,
  //         dataSource: "live" as const,
  //       };
  //     }

  //     return baseFeature;
  //   });
  // }, [dateRange, liveFeatureUsage]);

  const featureUtilization = useMemo(() => {
    const multiplier =
      dateRange === "7d"
        ? 0.32
        : dateRange === "this_month"
          ? 0.9
          : 1.0;

    return initialFeatureUtilization.map((feature) => {
      const baseFeature: FeatureUtilizationData = {
        ...feature,
        credits: Math.round(feature.credits * multiplier),
        generationsCount: Math.round(
          feature.generationsCount * multiplier,
        ),
        // The remaining fields still come from mock data.
        dataSource: "mock",
      };

      if (!featureUsage) {
        return baseFeature;
      }

      switch (feature.id) {
        case "ai-text":
          return {
            ...baseFeature,
            generationsCount: featureUsage.aiTextCount,
          };

        case "voice-speech":
          return {
            ...baseFeature,
            generationsCount: featureUsage.voiceGenerationCount,
          };

        case "video-gen":
          return {
            ...baseFeature,
            generationsCount: featureUsage.videoCount,
          };

        case "image-gen":
          return {
            ...baseFeature,
            generationsCount: featureUsage.imageCount,
          };

        default:
          return baseFeature;
      }
    });
  }, [dateRange, featureUsage]);

  // Real recent activity based on payment activity
  // const realRecentActivity = useMemo<StudioActivity[]>(() => {
  //   return paymentActivity.map((payment) => {
  //     // تحويل الـ status القادمة من الـ API إلى نوع متوافق
  //     const normalizedStatus: "Success" | "Pending" | "Failed" =
  //       payment.status?.toLowerCase() === "successful" ||
  //         payment.status?.toLowerCase() === "success"
  //         ? "Success"
  //         : payment.status?.toLowerCase() === "pending"
  //           ? "Pending"
  //           : "Failed";

  //     return {
  //       id: payment.id,
  //       userName: payment.userName || payment.userId,
  //       userBadge: "Payment",
  //       avatarBg: "bg-emerald-100 text-emerald-800",
  //       description: `${payment.paymentMethod} payment — ${payment.status}`,
  //       creditsChange: 0,
  //       timestamp: payment.createdAt,
  //       timeAgo: new Date(payment.createdAt).toLocaleString(),
  //       eventType: "Transactions",
  //       transactionId: payment.transactionId,
  //       status: normalizedStatus,
  //       isStripe: payment.paymentMethod?.toLowerCase().includes("stripe") ?? false,
  //       details: `${payment.amount.toLocaleString()} ${payment.currency}`,
  //     };
  //   });
  // }, [paymentActivity]);


  // Filtered recent activity
  // const filteredActivity = useMemo(() => {
  //   const source =
  //     realRecentActivity.length > 0
  //       ? realRecentActivity
  //       : recentActivity;

  //   if (eventTypeFilter === "All Events") {
  //     return source;
  //   }

  //   return source.filter(
  //     (act) => act.eventType === eventTypeFilter
  //   );
  // }, [
  //   realRecentActivity,
  //   recentActivity,
  //   eventTypeFilter,
  // ]);

  const filteredActivity = useMemo(() => {
    if (eventTypeFilter === "All Events") {
      return recentActivity;
    }

    return recentActivity.filter(
      (activity) => activity.eventType === eventTypeFilter,
    );
  }, [recentActivity, eventTypeFilter]);

  // Refresh action
  const refreshDashboard = async () => {
    setIsRefreshing(true);

    try {
      const activity = await fetchRecentActivity();

      setRecentActivity(activity);
      setActivityStatus("live");
      setLastUpdated("Just now");

      showToast("success", "Studio activity refreshed");
    } catch (error) {
      console.error("Failed to refresh Studio activity:", error);

      setActivityStatus("error");
      showToast("error", "Failed to refresh Studio activity");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Add Enterprise Credits
  const addEnterpriseCredits = async ({
    account,
    amount,
    reason,
  }: {
    account: string;
    amount: number;
    reason?: string;
    notes?: string;
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAdditionalCreditsAdded((prev) => prev + amount);

    const newActivity: StudioActivity = {
      userId: account,
      id: "act-" + Date.now(),
      userName: account,
      userBadge: "Enterprise Credit Allocation",
      avatarBg: "bg-orange-100 text-orange-800",
      description: reason || `Manual Enterprise Credit Injection (+${amount.toLocaleString()} credits)`,
      creditsChange: amount,
      timestamp: new Date().toISOString(),
      timeAgo: "Just now",
      eventType: "Credits",
      transactionId: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Success",
      details: `Allocated by Evelyn Rostova for ${account}. Reason: ${reason || "Direct allocation"}`,
    };

    setRecentActivity((prev) => [newActivity, ...prev]);
    showToast("success", "Credits added successfully.");
  };

  // Cancel Pipeline
  const cancelPipeline = (pipelineId: string) => {
    setActivePipelines((prev) =>
      prev.map((pipe) =>
        pipe.id === pipelineId
          ? {
            ...pipe,
            status: "Cancelled",
            eta: "Cancelled by Admin",
            logs: [
              ...pipe.logs,
              {
                timestamp: new Date().toLocaleTimeString(),
                level: "WARN",
                message: "Pipeline terminated manually by Developer/Admin console request.",
              },
            ],
          }
          : pipe
      )
    );

    const target = activePipelines.find((p) => p.id === pipelineId);
    if (target) {
      const cancelLog: StudioActivity = {
        userId: target.user,
        id: "act-cancel-" + Date.now(),
        userName: target.user,
        userBadge: target.userRole || "Creator",
        avatarBg: "bg-red-100 text-red-800",
        description: `Cancelled Pipeline: ${target.name} (Job ${target.jobId})`,
        creditsChange: 0,
        timestamp: new Date().toISOString(),
        timeAgo: "Just now",
        eventType: "Generations",
        pipelineId: target.id,
        jobId: target.jobId,
        status: "Failed",
      };
      setRecentActivity((prev) => [cancelLog, ...prev]);
    }

    showToast("info", "Pipeline cancelled");
  };

  // Retry Pipeline
  const retryPipeline = (pipelineId: string) => {
    setActivePipelines((prev) =>
      prev.map((pipe) =>
        pipe.id === pipelineId
          ? {
            ...pipe,
            status: "Processing",
            progress: 15,
            eta: "42s",
            logs: [
              ...pipe.logs,
              {
                timestamp: new Date().toLocaleTimeString(),
                level: "INFO",
                message: "Retrying execution: Worker assigned on US-East-GPU-Node-02",
              },
            ],
          }
          : pipe
      )
    );
    showToast("success", "Pipeline retry initiated");
  };

  // Toggle Model Training Pause
  const toggleTrainingPause = () => {
    const isCurrentlyActive = modelTraining.trainingStatus === "Active";
    const nextStatus = isCurrentlyActive ? "Paused" : "Active";
    setModelTraining((prev) => ({
      ...prev,
      trainingStatus: nextStatus,
    }));

    if (isCurrentlyActive) {
      showToast("info", "Model training paused");
    } else {
      showToast("success", "Model training resumed");
    }
  };

  // Export Data
  const exportData = async ({
    format,
  }: {
    scope: string;
    format: "csv" | "json";
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simulate browser download
    const dummyContent =
      format === "json"
        ? JSON.stringify({ kpiStats, chartData, featureUtilization, dateRange }, null, 2)
        : `Date,Credits Used,Credits Recharged,Difference\n` +
        chartData.map((d) => `${d.date},${d.used},${d.recharged},${d.difference}`).join("\n");

    const blob = new Blob([dummyContent], {
      type: format === "json" ? "application/json" : "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `muejam-studio-export-${dateRange}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("success", "Dashboard data exported successfully.");
  };

  return (
    <StudioContext.Provider
      value={{
        activityStatus,
        dateRange,
        setDateRange,
        customRange,
        setCustomRange,
        eventTypeFilter,
        setEventTypeFilter,
        isRefreshing,
        lastUpdated,
        clusterLatency,
        refreshDashboard,
        kpiStats,
        chartData,
        peakVolumeInfo,
        featureUtilization,
        clusterHealth,
        alerts,
        activePipelines,
        recentActivity,
        filteredActivity,
        modelTraining,
        gpuUsage,
        addEnterpriseCredits,
        cancelPipeline,
        retryPipeline,
        toggleTrainingPause,
        exportData,
        activeDrawer,
        openDrawer: setActiveDrawer,
        closeDrawer: () => setActiveDrawer(null),
        activeModal,
        openModal: setActiveModal,
        closeModal: () => setActiveModal(null),
        toasts,
        showToast,
        dismissToast,
        featureUsage,
        featureUsageStatus,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return context;
}
