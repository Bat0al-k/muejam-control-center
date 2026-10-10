import {
  ActivePipeline,
  ChartDataPoint,
  FeatureUtilizationData,
  GpuResourceUsage,
  ModelTrainingInfo,
  ServiceHealth,
  StudioActivity,
  StudioAlert,
} from "./types";

export const initialChartData30Days: ChartDataPoint[] = [
  { day: "Day 01", date: "Sep 08, 2026", used: 34200, recharged: 42100, difference: 7900 },
  { day: "Day 03", date: "Sep 10, 2026", used: 38900, recharged: 46200, difference: 7300 },
  { day: "Day 06", date: "Sep 13, 2026", used: 58400, recharged: 51200, difference: -7200 },
  { day: "Day 08", date: "Sep 15, 2026", used: 64100, recharged: 74000, difference: 9900 },
  { day: "Day 10", date: "Sep 17, 2026", used: 69800, recharged: 82000, difference: 12200 },
  { day: "Day 12", date: "Sep 19, 2026", used: 78500, recharged: 98400, difference: 19900 },
  { day: "Day 14", date: "Sep 22, 2026", used: 92400, recharged: 91000, difference: -1400 },
  { day: "Day 18", date: "Sep 25, 2026", used: 76100, recharged: 114500, difference: 38400 },
  { day: "Day 21", date: "Sep 28, 2026", used: 104200, recharged: 128000, difference: 23800 },
  { day: "Day 24", date: "Oct 01, 2026", used: 94800, recharged: 102000, difference: 7200 },
  { day: "Day 27", date: "Oct 04, 2026", used: 182410, recharged: 196800, difference: 14390, peak: true },
  { day: "Day 29", date: "Oct 06, 2026", used: 128400, recharged: 145000, difference: 16600 },
  { day: "Day 30 (Today)", date: "Oct 07, 2026", used: 146200, recharged: 172000, difference: 25800 },
];

export const initialChartData7Days: ChartDataPoint[] = [
  { day: "Day 01", date: "Oct 01, 2026", used: 94800, recharged: 102000, difference: 7200 },
  { day: "Day 02", date: "Oct 02, 2026", used: 108200, recharged: 118000, difference: 9800 },
  { day: "Day 03", date: "Oct 03, 2026", used: 132000, recharged: 141000, difference: 9000 },
  { day: "Day 04", date: "Oct 04, 2026", used: 182410, recharged: 196800, difference: 14390, peak: true },
  { day: "Day 05", date: "Oct 05, 2026", used: 142100, recharged: 154000, difference: 11900 },
  { day: "Day 06", date: "Oct 06, 2026", used: 128400, recharged: 145000, difference: 16600 },
  { day: "Day 07 (Today)", date: "Oct 07, 2026", used: 146200, recharged: 172000, difference: 25800 },
];

export const initialClusterHealth: ServiceHealth[] = [
  {
    id: "api",
    name: "API",
    status: "Healthy",
    load: 42,
    queueSize: 3,
    errorRate: 0.01,
    avgLatency: "14ms",
    cluster: "US-East-Primary",
    lastChecked: "Just now",
    uptime: "99.99%",
    activeNodes: "12 / 12 Nodes Online",
    recentIncidents: [
      { id: "inc-1", timestamp: "Yesterday 18:22", message: "Edge CDN DNS sync normalized", resolved: true }
    ]
  },
  {
    id: "ai-gen",
    name: "AI Generation",
    status: "Healthy",
    load: 68,
    queueSize: 8,
    errorRate: 0.05,
    avgLatency: "1.4s",
    cluster: "US-East-GPU-Node-01-04",
    lastChecked: "8s ago",
    uptime: "99.94%",
    activeNodes: "32 / 32 H100 Tensor Cores",
    recentIncidents: [
      { id: "inc-2", timestamp: "3 days ago", message: "VRAM cache cleanup completed", resolved: true }
    ]
  },
  {
    id: "voice",
    name: "Voice Synthesis",
    status: "Healthy",
    load: 54,
    queueSize: 5,
    errorRate: 0.02,
    avgLatency: "2.1s",
    cluster: "US-East-Audio-Worker-Pool",
    lastChecked: "14s ago",
    uptime: "99.97%",
    activeNodes: "16 / 16 Worker Nodes",
    recentIncidents: []
  },
  {
    id: "video",
    name: "Video Rendering",
    status: "Healthy",
    load: 88,
    queueSize: 14,
    errorRate: 0.08,
    avgLatency: "38.5s",
    cluster: "US-East-Rendering-Pool",
    lastChecked: "12s ago",
    uptime: "99.89%",
    activeNodes: "24 / 24 Nodes Running (88% queue capacity)",
    recentIncidents: [
      { id: "inc-3", timestamp: "18m ago", message: "Job #3841 execution timeout on US-East Node", resolved: false }
    ]
  },
  {
    id: "storage",
    name: "Storage",
    status: "Healthy",
    load: 37,
    queueSize: 1,
    errorRate: 0.00,
    avgLatency: "4ms",
    cluster: "S3-Compatible NVMe Tier-0",
    lastChecked: "22s ago",
    uptime: "100.0%",
    activeNodes: "Distributed Multi-Zone Storage",
    recentIncidents: []
  },
  {
    id: "webhooks",
    name: "Webhooks",
    status: "Healthy",
    load: 21,
    queueSize: 0,
    errorRate: 0.01,
    avgLatency: "28ms",
    cluster: "Ingress Dispatcher Pool",
    lastChecked: "5s ago",
    uptime: "99.98%",
    activeNodes: "8 / 8 Dispatchers Online",
    recentIncidents: []
  }
];

export const initialAlerts: StudioAlert[] = [
  {
    id: "alert-1",
    severity: "high",
    type: "Generative Pipeline Timeout",
    message: "2 generative pipeline timeouts on US-East Node · Job #3841 exceeded 120s execution limit during 4k video encoding.",
    time: "18m ago",
    clusterNode: "US-East Node-04",
    jobId: "#3841",
    pipelineId: "3841",
    serviceId: "video"
  },
  {
    id: "alert-2",
    severity: "warning",
    type: "Queue Saturation Warning",
    message: "Video Rendering queue at 88% capacity. Consider scaling auto-provisioning rendering workers.",
    time: "32m ago",
    clusterNode: "US-East-Rendering-Pool",
    serviceId: "video"
  },
  {
    id: "alert-3",
    severity: "info",
    type: "Tensor Cache Maintenance",
    message: "Autonomous weight compaction scheduled for Tensor Core Cluster: Beta-04 at 06:00 UTC.",
    time: "1h ago",
    clusterNode: "Tensor Core Cluster: Beta-04"
  }
];

export const initialActivePipelines: ActivePipeline[] = [
  {
    id: "3842",
    name: "StyleGAN HD Cover",
    feature: "Image Generation",
    user: "Sarah Lin",
    userRole: "Creator Pro",
    jobId: "#3842",
    status: "Processing",
    progress: 94,
    eta: "12s",
    credits: 240,
    clusterNode: "US-East-GPU-Node-03",
    startedAt: "04:30:45 UTC",
    duration: "1m 39s",
    steps: [
      { name: "Request received", status: "completed", timestamp: "04:30:45", duration: "120ms" },
      { name: "Input validated", status: "completed", timestamp: "04:30:46", duration: "240ms" },
      { name: "Model initialized", status: "completed", timestamp: "04:30:48", duration: "1.8s" },
      { name: "Image generation", status: "completed", timestamp: "04:31:35", duration: "47s" },
      { name: "Post-processing", status: "active", timestamp: "04:32:10", duration: "In progress" },
      { name: "Storage sync", status: "pending" },
      { name: "Response delivery", status: "pending" },
    ],
    logs: [
      { timestamp: "04:30:45.102", level: "INFO", message: "Job #3842 queued by Sarah Lin [Creator Pro]" },
      { timestamp: "04:30:45.312", level: "INFO", message: "Validating latent prompt parameters & seed #92841" },
      { timestamp: "04:30:46.010", level: "INFO", message: "Dispatching to TensorRT Engine on US-East-GPU-Node-03" },
      { timestamp: "04:30:48.504", level: "INFO", message: "VRAM allocated: 18.2 GB allocated on H100 SXM5" },
      { timestamp: "04:31:02.190", level: "INFO", message: "Diffusion sampling step 25/50 completed (0.42s/it)" },
      { timestamp: "04:31:35.811", level: "INFO", message: "Sampling completed. Invoking Real-ESRGAN 4x upscaler" },
      { timestamp: "04:32:10.024", level: "INFO", message: "Super-resolution upscale at 94% · Writing EXIF headers" },
    ],
    outputUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
    outputDescription: "High-resolution generative cover art (4096x4096px, 16-bit PNG)"
  },
  {
    id: "3847",
    name: "Arabic Voice Clone",
    feature: "Voice Cloning",
    user: "Marcus Vance",
    userRole: "Enterprise Studio",
    jobId: "#3847",
    status: "Processing",
    progress: 62,
    eta: "38s",
    credits: 480,
    clusterNode: "US-East-GPU-Node-01",
    startedAt: "04:31:12 UTC",
    duration: "1m 12s",
    steps: [
      { name: "Audio sample ingestion", status: "completed", timestamp: "04:31:12", duration: "320ms" },
      { name: "Acoustic feature extraction", status: "completed", timestamp: "04:31:16", duration: "3.8s" },
      { name: "Phonetic alignment", status: "completed", timestamp: "04:31:28", duration: "11.2s" },
      { name: "Neural synthesis (Tacotron-Ar)", status: "active", timestamp: "04:32:00", duration: "In progress" },
      { name: "HiFi-GAN vocoder", status: "pending" },
      { name: "Lossless flac encoding", status: "pending" },
      { name: "Webhook dispatch", status: "pending" },
    ],
    logs: [
      { timestamp: "04:31:12.440", level: "INFO", message: "Voice cloning job initialized for Marcus Vance" },
      { timestamp: "04:31:14.210", level: "INFO", message: "Spectrogram parsed: 24kHz 16-bit stereo master input" },
      { timestamp: "04:31:28.090", level: "INFO", message: "Arabic diacritic normalization pass complete" },
      { timestamp: "04:32:01.320", level: "INFO", message: "Neural vocoder processing 62% of phoneme sequence" },
    ],
    outputUrl: "https://example.com/audio/voice-clone-3847.flac",
    outputDescription: "Cloned speech audio segment (3m 14s, Studio Master 24-bit 48kHz)"
  },
  {
    id: "3850",
    name: "Podcast Transcription",
    feature: "Audio Transcription",
    user: "Dr. Aris Thorne",
    userRole: "Academic",
    jobId: "#3850",
    status: "Queued",
    progress: 0,
    eta: "Queued · Pos #4",
    queuePosition: 4,
    credits: 120,
    clusterNode: "US-East-Worker-06",
    startedAt: "04:31:58 UTC",
    duration: "26s in queue",
    steps: [
      { name: "Queued in scheduling buffer", status: "active", timestamp: "04:31:58" },
      { name: "Audio chunking (VAD)", status: "pending" },
      { name: "Whisper-v3 Large dispatch", status: "pending" },
      { name: "Speaker diarization", status: "pending" },
      { name: "SRT & VTT export", status: "pending" },
    ],
    logs: [
      { timestamp: "04:31:58.820", level: "INFO", message: "Transcription request enqueued. Payload size: 84 MB" },
      { timestamp: "04:32:00.010", level: "INFO", message: "Priority: Normal. Position in cluster queue: #4" },
    ],
  },
  {
    id: "3851",
    name: "Marketing Video Reel",
    feature: "Video Rendering",
    user: "Elena Gomez",
    userRole: "Pro Creator",
    jobId: "#3851",
    status: "Processing",
    progress: 81,
    eta: "45s",
    credits: 650,
    clusterNode: "US-East-Rendering-Pool",
    startedAt: "04:29:10 UTC",
    duration: "3m 14s",
    steps: [
      { name: "Timeline parsing", status: "completed", timestamp: "04:29:10", duration: "1.2s" },
      { name: "Motion keyframe interpolation", status: "completed", timestamp: "04:29:45", duration: "34s" },
      { name: "Generative background inpainting", status: "completed", timestamp: "04:31:02", duration: "1m 16s" },
      { name: "GPU hardware rendering (NVENC)", status: "active", timestamp: "04:31:50", duration: "In progress" },
      { name: "Audio track muxing", status: "pending" },
      { name: "CDN artifact replication", status: "pending" },
    ],
    logs: [
      { timestamp: "04:29:10.150", level: "INFO", message: "Video rendering job #3851 started" },
      { timestamp: "04:29:45.890", level: "INFO", message: "128 keyframes synthesized with temporal consistency" },
      { timestamp: "04:31:50.040", level: "INFO", message: "4K 60fps ProRes render stream active (81% completed)" },
    ],
    outputUrl: "https://example.com/video/reel-3851.mp4",
    outputDescription: "Ultra-HD 4K 60fps promotional marketing reel (45 seconds)"
  },
  {
    id: "3841",
    name: "Autonomous Video Inpainting",
    feature: "Video Rendering",
    user: "Kavita Rao",
    userRole: "Enterprise Studio",
    jobId: "#3841",
    status: "Timeout",
    progress: 44,
    eta: "Timed out",
    credits: 520,
    clusterNode: "US-East Node-04",
    startedAt: "04:12:00 UTC",
    duration: "3m 00s (Exceeded 120s limit)",
    steps: [
      { name: "Job submission", status: "completed", timestamp: "04:12:00" },
      { name: "Temporal optical flow calculation", status: "completed", timestamp: "04:12:45" },
      { name: "Frame inpainting pass 1", status: "active", timestamp: "04:13:30" },
      { name: "Execution watchdog timeout triggered", status: "active", timestamp: "04:15:00" },
    ],
    logs: [
      { timestamp: "04:12:00.100", level: "INFO", message: "Job #3841 dispatched to US-East Node-04" },
      { timestamp: "04:13:40.500", level: "WARN", message: "Frame processing latency spike: 2.8s/frame (exceeds 1.0s target)" },
      { timestamp: "04:15:00.002", level: "ERROR", message: "Timeout: Job reached 180s hard timeout threshold. Worker killed." },
    ]
  }
];

export const initialFeatureUtilization: FeatureUtilizationData[] = [
  {
    dataSource: "mock",
    id: "ai-text",
    name: "AI Text Generation",
    percentage: 78,
    credits: 842188,
    color: "#E8785A",
    generationsCount: 28410,
    successRate: 99.8,
    failedCount: 42,
    avgProcessingTime: "1.2s",
    recentJobs: [
      { id: "J-9041", user: "Marcus Vance", time: "11m ago", credits: 80, status: "Success" },
      { id: "J-9038", user: "Apex Labs", time: "24m ago", credits: 350, status: "Success" },
      { id: "J-9031", user: "Sarah Lin", time: "42m ago", credits: 120, status: "Success" },
    ],
    subModels: [
      { name: "Muejam-LLM-70B-Instruct", share: 64, latency: "1.1s" },
      { name: "Claude-3.5-Enterprise-Connector", share: 22, latency: "1.4s" },
      { name: "Mistral-Large-Embeddings", share: 14, latency: "0.4s" }
    ]
  },
  {
    dataSource: "mock",
    id: "voice-speech",
    name: "Voice & Speech Synthesis",
    percentage: 56,
    credits: 340828,
    color: "#0F766E",
    generationsCount: 14220,
    successRate: 99.4,
    failedCount: 68,
    avgProcessingTime: "2.8s",
    recentJobs: [
      { id: "J-9044", user: "Sarah Lin", time: "4m ago", credits: 240, status: "Success" },
      { id: "J-9040", user: "Marcus Vance", time: "18m ago", credits: 480, status: "Success" },
      { id: "J-9029", user: "Dr. Aris Thorne", time: "1h ago", credits: 160, status: "Success" },
    ],
    subModels: [
      { name: "Neural-Voice-v4-Bilingual", share: 58, latency: "2.1s" },
      { name: "ElevenLabs-Direct-Stream", share: 28, latency: "2.9s" },
      { name: "WhisperX-Phoneme-Aligner", share: 14, latency: "0.8s" }
    ]
  },
  {
    dataSource: "mock",
    id: "video-gen",
    name: "Video Gen & Rendering",
    percentage: 65,
    credits: 430720,
    color: "#DC2626",
    generationsCount: 5180,
    successRate: 98.2,
    failedCount: 94,
    avgProcessingTime: "42.6s",
    recentJobs: [
      { id: "J-9046", user: "Elena Gomez", time: "1h ago", credits: 650, status: "Success" },
      { id: "J-9041", user: "Kavita Rao", time: "18m ago", credits: 520, status: "Timeout" },
      { id: "J-9032", user: "Studio Apex", time: "2h ago", credits: 1200, status: "Success" },
    ],
    subModels: [
      { name: "AnimateDiff-Lightning-v3", share: 44, latency: "38s" },
      { name: "Stable Video Diffusion XT", share: 38, latency: "46s" },
      { name: "NVENC-ProRes-Muxer", share: 18, latency: "8s" }
    ]
  },
  {
    dataSource: "mock",
    id: "image-gen",
    name: "Image & Artwork Generation",
    percentage: 34,
    credits: 240020,
    color: "#F59E0B",
    generationsCount: 18940,
    successRate: 99.6,
    failedCount: 38,
    avgProcessingTime: "3.4s",
    recentJobs: [
      { id: "J-9045", user: "Sarah Lin", time: "2m ago", credits: 240, status: "Success" },
      { id: "J-9037", user: "Studio Creative", time: "34m ago", credits: 180, status: "Success" },
      { id: "J-9022", user: "Dr. Aris Thorne", time: "3h ago", credits: 90, status: "Success" },
    ],
    subModels: [
      { name: "SDXL-Turbo-v2-Custom", share: 52, latency: "2.4s" },
      { name: "Midjourney-API-Bridge", share: 31, latency: "5.1s" },
      { name: "StyleGAN-HD-Core", share: 17, latency: "3.2s" }
    ]
  }
];

export const initialRecentActivity: StudioActivity[] = [
  {
    userId: "user-1",
    id: "act-1",
    userName: "Sarah Lin",
    userBadge: "Creator Pro",
    avatarBg: "bg-emerald-100 text-emerald-800",
    description: "Generated 12 Voice Synthesis tracks (Neural Model v4)",
    creditsChange: -240,
    timestamp: "2026-10-07T04:28:00Z",
    timeAgo: "4m ago",
    eventType: "Generations",
    jobId: "#3847",
    pipelineId: "3847",
    feature: "Voice & Speech Synthesis",
    status: "Success",
    details: "Batch multilingual generation for audiobook chapter 4."
  },
  {
    userId: "user-2",
    id: "act-2",
    userName: "Marcus Vance",
    userBadge: "Enterprise Studio",
    avatarBg: "bg-amber-100 text-amber-800",
    description: "Ran Batch Text Generation (Enterprise Prompt Cluster)",
    creditsChange: -80,
    timestamp: "2026-10-07T04:21:00Z",
    timeAgo: "11m ago",
    eventType: "Generations",
    jobId: "#3842",
    pipelineId: "3842",
    feature: "AI Text Generation",
    status: "Success",
    details: "Processed 40 semantic summaries across market reports."
  },
  {
    userId: "user-3",
    id: "act-3",
    userName: "Studio Pool Auto-Recharge",
    userBadge: "Stripe Enterprise",
    isStripe: true,
    isSystem: true,
    avatarBg: "bg-teal-100 text-teal-800",
    description: "Institutional Tier Monthly Auto-Provisioning Pipeline",
    creditsChange: 50000,
    timestamp: "2026-10-07T04:04:00Z",
    timeAgo: "28m ago",
    eventType: "Credits",
    transactionId: "TX-9902",
    status: "Success",
    details: "Corporate recurring invoice #INV-2026-981 auto-settled via Stripe."
  },
  {
    userId: "user-4",
    id: "act-4",
    userName: "Dr. Aris Thorne",
    userBadge: "Academic",
    avatarBg: "bg-purple-100 text-purple-800",
    description: "Dataset embedding synthesis & vector indexing",
    creditsChange: -120,
    timestamp: "2026-10-07T03:50:00Z",
    timeAgo: "42m ago",
    eventType: "Generations",
    jobId: "#3850",
    pipelineId: "3850",
    feature: "Audio Transcription",
    status: "Success",
    details: "Phonetic corpus transcript alignment for linguistic research."
  },
  {
    userId: "user-5",
    id: "act-5",
    userName: "Elena Gomez",
    userBadge: "Pro Creator",
    avatarBg: "bg-rose-100 text-rose-800",
    description: "Rendered 4k promo animation for product launch",
    creditsChange: -350,
    timestamp: "2026-10-07T03:28:00Z",
    timeAgo: "1h ago",
    eventType: "Generations",
    jobId: "#3851",
    pipelineId: "3851",
    feature: "Video Gen & Rendering",
    status: "Success",
    details: "Rendered 60s H.265 stream on US-East-Rendering-Pool."
  },
  {
    userId: "user-6",
    id: "act-6",
    userName: "Apex Media Labs",
    userBadge: "Enterprise Studio",
    avatarBg: "bg-blue-100 text-blue-800",
    description: "Manual Enterprise Credits Recharge (Admin Allocation)",
    creditsChange: 25000,
    timestamp: "2026-10-07T02:15:00Z",
    timeAgo: "2h ago",
    eventType: "Credits",
    transactionId: "TX-9891",
    status: "Success",
    details: "Direct account top-up approved by Evelyn Rostova."
  }
];

export const initialModelTraining: ModelTrainingInfo = {
  modelName: "Muejam Pose-v2",
  trainingStatus: "Active",
  currentEpoch: 4,
  totalEpochs: 12,
  progressPercent: 33,
  cluster: "Tensor Core Cluster: Beta-04 (8x NVIDIA H100 SXM5)",
  gpuUsage: "15.6 GB VRAM · 94% Compute Load",
  trainingDuration: "18h 42m",
  lastCheckpoint: "ckpt-pose-v2-epoch4-loss0.0312.safetensors",
  valLoss: 0.0312,
  trainLoss: 0.0298,
  totalParameters: "1.84 Billion Parameters",
  learningRate: "2.4e-5 (Cosine Annealing)"
};

export const initialGpuUsage: GpuResourceUsage = {
  totalVram: 96.0,
  usedVram: 72.4,
  availableVram: 23.6,
  queuePressure: "Nominal (Queue Depth: 4 jobs)",
  activePipelines: [
    { name: "Marketing Video Reel", jobId: "#3851", vramGb: 24.5, node: "US-East-Rendering-Pool" },
    { name: "StyleGAN HD Cover", jobId: "#3842", vramGb: 18.2, node: "US-East-GPU-Node-03" },
    { name: "Muejam Pose-v2 Fine-Tuning", jobId: "Train-Epoch-4", vramGb: 15.6, node: "Beta-04 Cluster" },
    { name: "Arabic Voice Clone", jobId: "#3847", vramGb: 14.1, node: "US-East-GPU-Node-01" },
  ],
  nodeDistribution: [
    { node: "US-East-GPU-Node-01", load: 78, vramUsed: 21.4, totalVram: 24, status: "Healthy" },
    { node: "US-East-GPU-Node-02", load: 64, vramUsed: 16.8, totalVram: 24, status: "Healthy" },
    { node: "US-East-GPU-Node-03", load: 89, vramUsed: 22.1, totalVram: 24, status: "Healthy" },
    { node: "Tensor Cluster Beta-04", load: 94, vramUsed: 22.8, totalVram: 24, status: "Heavy Compute" },
  ]
};
