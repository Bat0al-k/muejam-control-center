export type DateRangeOption = "7d" | "30d" | "this_month" | "prev_month" | "custom";

export type EventTypeFilter =
  | "All Events"
  | "Generations"
  | "Credits"
  | "Transactions"
  | "User Activity"
  | "System Events"
  | "Errors"
  | "API Events";

export interface ChartDataPoint {
  day: string;
  date: string;
  used: number;
  recharged: number;
  difference: number;
  peak?: boolean;
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: "Healthy" | "Degraded" | "Outage";
  load: number;
  queueSize: number;
  errorRate: number;
  avgLatency: string;
  cluster: string;
  lastChecked: string;
  uptime: string;
  activeNodes: string;
  recentIncidents: Array<{
    id: string;
    timestamp: string;
    message: string;
    resolved: boolean;
  }>;
}

export interface PipelineStep {
  name: string;
  status: "completed" | "active" | "pending";
  timestamp?: string;
  duration?: string;
}

export interface PipelineLogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
}

export interface ActivePipeline {
  id: string;
  name: string;
  feature: string;
  user: string;
  userRole?: string;
  jobId: string;
  status: "Processing" | "Queued" | "Completed" | "Failed" | "Timeout" | "Cancelled";
  progress: number;
  eta: string;
  queuePosition?: number;
  credits: number;
  clusterNode: string;
  startedAt: string;
  duration: string;
  steps: PipelineStep[];
  logs: PipelineLogEntry[];
  outputUrl?: string;
  outputDescription?: string;
}

export interface StudioAlert {
  id: string;
  severity: "high" | "warning" | "info";
  type: string;
  message: string;
  time: string;
  clusterNode: string;
  jobId?: string;
  pipelineId?: string;
  serviceId?: string;
}

// export interface StudioActivity {
//   id: string;
//   userName: string;
//   userBadge: string;
//   avatarBg?: string;
//   isSystem?: boolean;
//   isStripe?: boolean;
//   description: string;
//   creditsChange: number;
//   timestamp: string;
//   timeAgo: string;
//   eventType: EventTypeFilter;
//   jobId?: string;
//   pipelineId?: string;
//   transactionId?: string;
//   feature?: string;
//   status: "Success" | "Pending" | "Failed";
//   details?: string;
// }

export interface StudioActivity {
  id: string;
  userId: string;

  userName: string;
  userBadge: string;
  avatarBg?: string;
  isSystem?: boolean;
  isStripe?: boolean;

  description: string;
  creditsChange: number;

  timestamp: string;
  timeAgo: string;
  eventType: EventTypeFilter;

  jobId?: string;
  pipelineId?: string;
  transactionId?: string;
  feature?: string;

  status: "Success" | "Pending" | "Failed";
  details?: string;
}

export interface FeatureUtilizationData {
  dataSource: "live" | "mock";
  id: string;
  name: string;
  percentage: number;
  credits: number;
  color: string;
  generationsCount: number;
  successRate: number;
  failedCount: number;
  avgProcessingTime: string;
  recentJobs: Array<{
    id: string;
    user: string;
    time: string;
    credits: number;
    status: string;
  }>;
  subModels: Array<{
    name: string;
    share: number;
    latency: string;
  }>;
}

export interface StudioFeatureUsage {
  aiTextCount: number;
  voiceGenerationCount: number;
  videoCount: number;
  imageCount: number;
  indexedImageCount: number;
  aiTextTotalTokens: number;
  aiTextTotalCostUsd: number;

  aiTextRecent: {
    id: string;
    operation: string;
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    total_cost_usd: number | string;
    created_at: string;
  }[];

  voiceRecent: {
    id: string;
    voice_name: string | null;
    provider: string | null;
    model_id: string | null;
    text_content: string;
    created_at: string | null;
  }[];

  videoRecent: {
    id: string;
    title: string | null;
    duration: number | string | null;
    url: string | null;
    created_at: string | null;
  }[];

  imageRecent: {
    id: string;
    name: string;
    category: string | null;
    width: number;
    height: number;
    mime_type: string;
    size_bytes: number;
    status: string;
    model_version: string | null;
    indexed_at: string | null;
    created_at: string;
    error_message: string | null;
  }[];
}

export interface ModelTrainingInfo {
  modelName: string;
  trainingStatus: "Active" | "Paused" | "Completed";
  currentEpoch: number;
  totalEpochs: number;
  progressPercent: number;
  cluster: string;
  gpuUsage: string;
  trainingDuration: string;
  lastCheckpoint: string;
  valLoss: number;
  trainLoss: number;
  totalParameters: string;
  learningRate: string;
}

export interface GpuResourceUsage {
  totalVram: number;
  usedVram: number;
  availableVram: number;
  queuePressure: string;
  activePipelines: Array<{
    name: string;
    jobId: string;
    vramGb: number;
    node: string;
  }>;
  nodeDistribution: Array<{
    node: string;
    load: number;
    vramUsed: number;
    totalVram: number;
    status: string;
  }>;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  title?: string;
}

export type ActiveDrawerType =
  | { type: "environment" }
  | { type: "alerts" }
  | { type: "serviceHealth"; serviceId: string }
  | { type: "creators" }
  | { type: "creditActivity"; point: ChartDataPoint }
  | { type: "featureUtilization"; featureId: string }
  | { type: "pipelineDetails"; pipelineId: string }
  | { type: "pipelineLogs"; pipelineId: string }
  | { type: "gpuUsage" }
  | { type: "modelTraining" }
  | { type: "inspectWeights" }
  | { type: "activityDetails"; activityId: string }
  | { type: "userActivity"; userId: string }
  | null;

export type ActiveModalType =
  | { type: "addCredits" }
  | { type: "export" }
  | { type: "cancelPipeline"; pipelineId: string }
  | { type: "retryPipeline"; pipelineId: string }
  | { type: "pauseTraining" }
  | { type: "customDateRange" }
  | { type: "pipelineOutput"; pipelineId: string }
  | { type: "searchPalette" }
  | null;