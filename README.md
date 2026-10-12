# Muejam Company Control Center (معجم)

> Internal enterprise control center for managing **Studio editor** and **Library Platform** operations — built with **Next.js 14 App Router**, **TypeScript**, **Apollo Client**, and **Hasura GraphQL**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Products](#-products)
  - [1. AI Studio Vertical](#1-ai-studio-vertical)
  - [2. Library Platform Vertical](#2-library-platform-vertical)
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
| `/dashboard/studio/users` | **Studio Users** | User directory, subscription plans (`Enterprise Studio`, `Creator Pro`, `Academic`), and token quotas. |
| `/dashboard/studio/users/[id]` | **User Profile** | Deep-dive telemetry for a single studio tenant. |
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
| `/dashboard/library/users` | **Library Users** | Reader community and account management. |

---

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
│   ├── api/              # Secure server-side API endpoints (Auth & Studio)
│   ├── dashboard/        # Main Dashboard application
│   │   ├── studio/       # AI Studio Vertical pages & layouts
│   │   ├── library/      # Library Platform Vertical pages & layouts
│   │   └── test-auth/    # Role validation tester (Developer only)
│   └── unauthorized/     # 403 Access Denied fallback
├── components/           # UI Components
│   ├── layout/           # Shared layout (Sidebar, Header, ProductSwitcher, SearchPalette)
│   ├── studio/           # AI Studio specific UI (KPIs, Charts, Drawers, Modals)
│   ├── library/          # Library Platform specific UI (ReviewCards, ActionModals)
│   └── shared/           # Reusable generic UI components
├── features/             # Business Logic & Domains
│   ├── auth/             # Roles, Permissions, Auth services
│   ├── studio/           # Studio Context, Drawer state, Mock data
│   └── library/          # Library domain services & types
├── graphql/              # Hasura GraphQL layer
│   ├── client.ts         # Secure server-side executeGraphQL function
│   ├── queries/          # GraphQL Query documents (Studio, Library, Auth)
│   └── mutations/        # GraphQL Mutation documents
├── hooks/                # Custom React hooks (useProduct, etc.)
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
