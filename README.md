# Muejam Company Control Center (معجم)

> Internal enterprise control center for managing **Studio editor** and **Library Platform** operations — built with **Next.js 14 App Router**, **TypeScript**, **Apollo Client**, and **Hasura GraphQL**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Products](#-products)
  - [1. AI Studio Vertical](#1-ai-studio-vertical)
  - [2. Library Platform Vertical](#2-library-platform-vertical)
- [Multi-Schema User Activity Tracking & Account Isolation](#-multi-schema-user-activity-tracking--account-isolation)
  - [Database Architecture & Hasura Tracking](#database-architecture--hasura-tracking)
  - [Session Lifecycle & Heartbeat Engine](#session-lifecycle--heartbeat-engine)
  - [Studio & Library Users KPIs & Session Timestamps](#studio--library-users-kpis--session-timestamps)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
  - [Roles Definition](#roles-definition)
  - [Permissions Matrix](#permissions-matrix)
  - [Route Guards & Security](#route-guards--security)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)

---

## 🌟 Overview

**Company Control Center** is the unified central management dashboard for **Muejam (معجم)**. It is architected to govern two separate product verticals under a single, highly performant administrative umbrella:

1. **Studio Vertical**: Cloud compute clusters, active inference pipelines, credit quotas, tenant activity, and GPU resource telemetry.
2. **Library Platform Vertical**: Digital publications, manuscript submissions, editorial reviews, author management, and reader interactions.

---

## 🚀 Products

### 1. Studio Vertical

Accessed via `/dashboard/studio` (Authorized: **Developer** only).

| Route | View | Description |
| :--- | :--- | :--- |
| `/dashboard/studio` | **Studio Console** | Real-time KPI metrics, Cluster Health, Active Pipelines, Feature Utilization, and Recent Activity. |
| `/dashboard/studio/users` | **Studio Users** | Strictly isolated **Studio** accounts, 5 KPI cards (Total Studio Accounts, Active Users, Online Users, Offline Users, Verified Emails), and per-user **Came Online** (`onlineAt`) & **Went Offline** (`offlineAt`) timestamps. |
| `/dashboard/studio/users/[id]` | **User Profile** | Deep-dive telemetry for a single Studio tenant, including full **Studio Sessions History** (`Voice_Studio.user_sessions`), projects, payments, and AI usage. |
| `/dashboard/studio/credits` | **Credits Ledger** | Enterprise token provisioning, combustion burn rate, and corporate tenant wallets. |
| `/dashboard/studio/transactions` | **Transactions Ledger** | Billing records, payment gateway receipts (Stripe, Wire), and invoicing status. |
| `/dashboard/studio/activity` | **Activity Logs** | Historical audit ledger of synthesis events, cluster executions, and security checks. |
| `/dashboard/studio/usage` | **Analytics & Insights** | High-density charts for feature consumption and hardware allocation. |

#### 🗂️ Studio Slide-Over Drawers (13 Interactive Drawers)
Controlled dynamically via `useStudio()` context without losing page state:
- `UserActivityDrawer` · `PipelineDetailsDrawer` · `FeatureUtilizationDrawer`
- `ServiceHealthDrawer` · `GpuUsageDrawer` · `ModelTrainingDrawer`
- `InspectWeightsDrawer` · `EnvironmentDrawer` · `CreditActivityDrawer`
- `AlertsDrawer` · `CreatorsDrawer` · `ActivityDetailsDrawer` · `DrawerShell`

---

### 2. Library Platform Vertical

Accessed via `/dashboard/library` (Authorized: **Developer**, **Admin**, **Author**).

| Route | View | Description |
| :--- | :--- | :--- |
| `/dashboard/library` | **Library Console** | Platform overview for book management and publishing operations. |
| `/dashboard/library/books` | **Books Directory** | Catalog of submissions, published manuscripts, and draft revisions. |
| `/dashboard/library/reviews` | **Editorial Reviews** | Multi-stage review queue for approving, rejecting, or requesting manuscript changes. |
| `/dashboard/library/authors` | **Authors Directory** | Profiles and publications history of onboarded authors. |
| `/dashboard/library/messages` | **Direct Messages** | Editorial communication between review committee and authors. |
| `/dashboard/library/notifications` | **Notifications** | Publication alerts and status updates. |
| `/dashboard/library/activity` | **Library Activity** | Event ledger for publishing and editorial changes. |
| `/dashboard/library/users` | **Library Users** | Strictly isolated **Library** accounts (Authors & Readers), 5 KPI cards (Total Library Accounts, Active Users, Online Users, Offline Users, Verified Emails), and per-user **Came Online** & **Went Offline** timestamps. |
| `/dashboard/library/users/[id]` | **Library User Profile** | Detailed Library user view with **Library Sessions History** (`libaray.user_sessions`), online/offline status, and author profiles. |

## 📡 Multi-Schema User Activity Tracking & Account Isolation

The platform implements a **Multi-Schema User Activity & Presence System** that strictly isolates **Muejam Studio** accounts from **Muejam Library** accounts while tracking real-time online/offline sessions, active user counts, and account suspension cascades.

### Database Architecture & Hasura Tracking

Tracked across three PostgreSQL schemas in Hasura (`muejam_dev`):

| Schema & Object | Hasura GraphQL Root | Purpose |
| :--- | :--- | :--- |
| `auth.user_activity` | `auth_user_activity` | Central product & status registry mapping each `user_id` to `product` (`'studio'` \| `'library'`), `account_status` (`'active'` \| `'suspended'`), and `last_login_at`. |
| `"Voice_Studio".user_sessions` | `Voice_Studio_user_sessions` | Isolated Studio session log storing `started_at` (Came Online), `last_seen` (Heartbeat), `ended_at` (Went Offline), `ip_address`, and `user_agent`. |
| `"Voice_Studio".user_presence` | `Voice_Studio_user_presence` | Real-time SQL view computing `status = 'online'` when `ended_at IS NULL` and `last_seen >= NOW() - INTERVAL '90 seconds'`. |
| `libaray.user_sessions` | `libaray_user_sessions` | Isolated Library session log storing `started_at`, `last_seen`, `ended_at`, `ip_address`, and `user_agent`. |
| `libaray.user_presence` | `libaray_user_presence` | Real-time SQL view computing `status = 'online'` vs `'offline'` for Library users using the 90-second heartbeat window. |
| `auth.trg_cascade_user_suspension` | *(PostgreSQL Trigger)* | Automatically sets `ended_at = NOW()` on all active sessions in both `"Voice_Studio".user_sessions` and `libaray.user_sessions` whenever an account is suspended (`account_status = 'suspended'`). |

### Session Lifecycle & Heartbeat Engine

1. **Login & Session Creation (`POST /api/auth/token`)**:
   - Verifies that the user is not disabled or suspended (`403 Account suspended`).
   - Upserts `auth.user_activity` with the resolved `product` (`studio` or `library`) and `last_login_at = NOW()`.
   - Inserts a new active session (`started_at = NOW()`, `last_seen = NOW()`) into the corresponding product schema.
2. **Real-Time Client Heartbeat (`POST /api/session/heartbeat`)**:
   - `useHeartbeat` (`src/hooks/useHeartbeat.ts`) and `<SessionTracker />` (`src/components/SessionTracker.tsx`) are mounted in `StudioLayoutClient` (`product="studio"`) and `LibraryLayoutClient` (`product="library"`).
   - Pings `/api/session/heartbeat` every **30 seconds** while the tab is visible (and immediately on `visibilitychange` resume) to keep `last_seen` fresh within the **90-second** online presence threshold.
3. **Logout & Session Termination (`POST /api/auth/logout`)**:
   - Closes all active sessions (`ended_at = NOW()`, `last_seen = NOW()`) across `"Voice_Studio".user_sessions` and `libaray.user_sessions` before clearing authentication cookies, recording the exact timestamp the user went offline.

### Studio & Library Users KPIs & Session Timestamps

Both `/dashboard/studio/users` and `/dashboard/library/users` enforce strict account separation and expose:

- **5 Real-Time KPI Cards**:
  1. **Product Accounts (`Studio Accounts` / `Library Accounts`)**: Total accounts belonging to the current vertical, with a live counter and quick-switch link showing the isolated accounts in the other vertical.
  2. **Active Users**: Count of enabled accounts (`account_status = 'active'` and `disabled = false`), alongside the count of suspended accounts.
  3. **Online Users**: Users currently active within the last 90 seconds via the product's `user_presence` view.
  4. **Offline Users**: Users whose sessions have ended or whose last heartbeat exceeded 90 seconds.
  5. **Verified Emails**: Count of verified accounts (plus Author vs. Reader breakdown on the Library Users page).
- **Per-User Online & Offline Timestamps**:
  - **Came Online (`Online At`)**: Displays the exact session start timestamp (`started_at` / `last_login_at`) and relative time (e.g., `Started 12m ago`).
  - **Went Offline (`Offline At`)**: Displays a live pulsing `Currently Online` badge while active, or the exact disconnect/logout timestamp (`ended_at` / `last_seen`) and relative time once offline.
  - **Developer Controls**: Developers can edit user details, switch a user's assigned product (`studio` ↔ `library`), or suspend/disable an account (which immediately terminates active sessions).

## 🔐 Role-Based Access Control (RBAC)

Access control is enforced at both the **server level** (Server Component Layouts and Pages) and **API route level**.

### Roles Definition

Defined in `src/features/auth/roles.ts`:

| Role Constant | Database Role (`Hasura`) | Display Label | Access Scope |
| :--- | :--- | :--- | :--- |
| `USER_ROLES.DEVELOPER` | `"admin"` | **Developer** | **Full System Access** (AI Studio, Library Platform, System Roles & Settings). |
| `USER_ROLES.ADMIN` | `"sub_admin"` | **Admin** (Sub-Admin) | **Library Platform Only**. Strictly forbidden from accessing AI Studio or system roles. |
| `USER_ROLES.AUTHOR` | `"author"` | **Author** | **Library Platform Only** (Author-scoped actions). Strictly forbidden from accessing AI Studio. |

### Permissions Matrix

Defined in `src/features/auth/permissions.ts`:

| Permission | Permission Key | Developer (`admin`) | Admin (`sub_admin`) | Author (`author`) |
| :--- | :--- | :---: | :---: | :---: |
| **Library Access** | `library:view` | ✅ | ✅ | ✅ |
| **Books View All** | `books:view-all` | ✅ | ✅ | ❌ |
| **Books View Own** | `books:view-own` | ✅ | ❌ | ✅ |
| **Books Upload** | `books:upload` | ✅ | ❌ | ✅ |
| **Books Edit Own** | `books:edit-own` | ✅ | ❌ | ✅ |
| **Books Review** | `books:review` | ✅ | ✅ | ❌ |
| **Books Approve** | `books:approve` | ✅ | ✅ | ❌ |
| **Books Reject** | `books:reject` | ✅ | ✅ | ❌ |
| **Books Request Edits** | `books:request-edits` | ✅ | ✅ | ❌ |
| **Users View** | `users:view` | ✅ | ✅ | ❌ |
| **Users Manage** | `users:manage` | ✅ | ❌ | ❌ |
| **Studio View** | `studio:view` | ✅ | ❌ | ❌ |
| **Studio Usage** | `studio:usage-view` | ✅ | ❌ | ❌ |
| **Studio Payments** | `studio:payments-view` | ✅ | ❌ | ❌ |
| **Studio Logs** | `studio:logs-view` | ✅ | ❌ | ❌ |
| **System Roles Manage** | `roles:manage` | ✅ | ❌ | ❌ |

### Route Guards & Security

1. **Dashboard Root (`/dashboard`)**:
   - `Developer` is routed to `/dashboard/studio`.
   - `Admin` & `Author` are automatically routed to `/dashboard/library`.
2. **Studio Guard (`src/app/dashboard/studio/layout.tsx`)**:
   - Server-side validation checking `hasPermission(auth.role, PERMISSIONS.STUDIO_VIEW)`.
   - Unauthorized users (`sub_admin`, `author`) are instantly redirected to `/unauthorized`.
3. **Library Guard (`src/app/dashboard/library/layout.tsx`)**:
   - Validates `PERMISSIONS.LIBRARY_VIEW` for all authenticated members.
4. **API Security**:
   - Studio backend routes (`/api/studio/*`) require server-side permission checks via `requirePermission(PERMISSIONS.STUDIO_VIEW)`.

---

## 🏗 Architecture & Directory Structure

```
src/
├── app/                  # Next.js 14 App Router
│   ├── (auth)/           # Authentication flows (Login, Register, Forgot Password)
│   ├── api/              # Secure server-side API endpoints
│   │   ├── auth/         # Token issuance, session creation & logout termination
│   │   ├── session/      # Real-time 30s heartbeat endpoint (/api/session/heartbeat)
│   │   ├── studio/       # Studio users, activity, credits & transactions APIs
│   │   └── library/      # Isolated Library users & profile details APIs
│   ├── dashboard/        # Main Dashboard application
│   │   ├── studio/       # AI Studio Vertical pages & layouts (with SessionTracker)
│   │   ├── library/      # Library Platform Vertical pages & layouts (with SessionTracker)
│   │   └── test-auth/    # Role validation tester (Developer only)
│   └── unauthorized/     # 403 Access Denied fallback
├── components/           # UI Components
│   ├── layout/           # Shared layout (Sidebar, Header, ProductSwitcher, SearchPalette)
│   ├── studio/           # AI Studio specific UI (KPIs, Charts, Drawers, Modals)
│   ├── library/          # Library Platform specific UI (ReviewCards, ActionModals)
│   ├── shared/           # Reusable generic UI components
│   └── SessionTracker.tsx # Invisible client heartbeat tracker mounted per product layout
├── features/             # Business Logic & Domains
│   ├── auth/             # Roles, Permissions, Auth services
│   ├── studio/           # Studio service (isolated Studio users, KPIs & session telemetry)
│   └── library/          # Library service (isolated Library users, KPIs & session telemetry)
├── graphql/              # Hasura GraphQL layer
│   ├── client.ts         # Secure server-side executeGraphQL function
│   ├── queries/          # GraphQL Query documents (Studio, Library, Auth & User Activity)
│   └── mutations/        # GraphQL Mutation documents
├── hooks/                # Custom React hooks (useHeartbeat, useProduct, etc.)
├── lib/                  # Utilities (server-auth.ts, cn helper)
└── types/                # Core TypeScript definitions
```

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) (App Router, Server Components)
- **Language**: [TypeScript 5](https://typescriptlang.org)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com) + PostCSS
- **Data Layer**: [Hasura GraphQL](https://hasura.io) & [Apollo Client](https://apollographql.com)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs` + HttpOnly Cookie sessions
- **Charts**: [Recharts](https://recharts.org)
- **Icons**: [React Icons (Feather Icons)](https://react-icons.github.io/react-icons/)
- **Schema Validation**: [Zod](https://zod.dev)

---

## 💻 Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/Bat0al-k/muejam-control-center.git
cd muejam-control-center
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Hasura and JWT credentials (see [Environment Variables](#-environment-variables)).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Configure the following keys in `.env.local`:

```env
# Hasura GraphQL Endpoint (Server-Side)
HASURA_GRAPHQL_URL=https://your-hasura-endpoint.hasura.app/v1/graphql

# Hasura GraphQL Public URL (Client-Side)
NEXT_PUBLIC_HASURA_GRAPHQL_URL=https://your-hasura-endpoint.hasura.app/v1/graphql

# Hasura Admin Secret (Server-Side only — keep private)
HASURA_ADMIN_SECRET=your_hasura_admin_secret

# JWT Secret (Must match Hasura JWT JSON configuration)
HASURA_GRAPHQL_JWT_SECRET=your_hasura_jwt_secret

# NextAuth Secret
NEXTAUTH_SECRET=your_nextauth_secret
```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start development server on port 3000 with HMR. |
| `npm run type-check` | Run TypeScript compiler type checking without emitting files. |
| `npm run lint` | Run ESLint static analysis. |
| `npm run build` | Compile and bundle production build. |
| `npm run start` | Start production server. |
| `npm run format` | Run Prettier across all `src` files. |

---

Made with ❤️ by the **Muejam (معجم)** Core Team.
