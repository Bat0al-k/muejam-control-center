export type LibraryDateRangeOption =
  | "7d"
  | "30d"
  | "this_month"
  | "prev_month"
  | "custom";

export type SubmissionFilter = "all" | "pending" | "approved" | "issues";

export type SubmissionStatus =
  | "Approved"
  | "Pending Review"
  | "Changes Requested"
  | "Rejected"
  | "Draft";

export interface PendingBookItem {
  id: string;
  category: string;
  timeAgo: string;
  title: string;
  author: string;
  pages: number;
  fileSize: string;
  secondaryAction: "Quick Reject" | "Inspect";
  coverTheme: "teal" | "navy" | "light" | "amber" | "slate";
  coverTitle: string;
  coverSubtitle: string;
  isbn?: string;
}

export interface SubmissionRecord {
  id: string;
  title: string;
  isbn: string;
  pages: string;
  authorName: string;
  authorEmail: string;
  authorInitials: string;
  authorAvatarBg: string;
  submittedDate: string;
  submittedTime: string;
  isToday?: boolean;
  status: SubmissionStatus;
  coverTheme: "light" | "teal" | "amber" | "slate" | "draft" | "navy";
  category?: string;
  fileSize?: string;
  description?: string;
  tags?: string[];
  coverImageUrl?: string;
  subtitle?: string;
  wordCount?: string;
  chapterCount?: number;
  assetArchive?: string;
  version?: string;
  editorialQueue?: string;
  authorDegree?: string;
  authorBooksCount?: number;
  authorRating?: string;
  authorTier?: string;
}

export interface LibraryKpiStats {
  totalUsers: number;
  usersTrend: string;
  totalAuthors: number;
  authorsTrend: string;
  totalBooks: number;
  indexedPercent: string;
  pendingBooksBase: number;
  approvedBooks: number;
  activeCatalogPercent: string;
  rejectedBooks: number;
}

export interface LibraryAlert {
  id: string;
  severity: "high" | "warning" | "info";
  type: string;
  message: string;
  time: string;
  node: string;
}

export interface LibraryToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  title?: string;
}

export type LibraryActiveModalType =
  | { type: "submitBook" }
  | { type: "reviewBook"; book: PendingBookItem }
  | { type: "exportReport" }
  | null;

export type LibraryActiveDrawerType =
  | { type: "submissionDetails"; submissionId: string }
  | { type: "environment" }
  | null;

// ________________________________________________________________________

export interface BookEditorialReview {
  id: string;
  bookTitle: string;
  bookSubtitle: string;
  edition: string;
  category: string;
  version: string;
  status: SubmissionStatus;
  submittedBy: string;
  submittedDate: string;
  editorialQueue: string;
  isbn: string;
  pageCount: number;
  wordCount: string;
  chapterCount: number;
  assetArchiveSize: string;
  author: {
    name: string;
    avatarUrl?: string;
    avatarBg?: string;
    avatarInitials: string;
    degree: string;
    email: string;
    verified: boolean;
    booksCount: number;
    avgRating: number;
    tier: string;
  };
  chapters: Array<{
    number: number;
    title: string;
    subtitle?: string;
    paragraphs: string[];
  }>;
  flaggedIssues: string[];
  revisionDirectives: string;
  coverTheme?: "teal" | "navy" | "light" | "amber" | "slate";
}

// export type LibraryActiveModalType =
//   | { type: "submitBook" }
//   | { type: "reviewBook"; book: PendingBookItem }
//   | { type: "exportReport" }
//   | null;

// export type LibraryActiveDrawerType =
//   | { type: "submissionDetails"; submissionId: string }
//   | { type: "environment" }
//   | null;

