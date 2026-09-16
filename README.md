# Company Control Center

> Internal admin dashboard for managing **Library** and **Studio** products — built with Next.js 14 App Router, TypeScript, Apollo Client, and Hasura GraphQL.

---

## Architecture

```
app/          → WHERE    — Next.js routes & pages
components/   → WHAT     — UI components (layout, shared, per-product)
features/     → HOW      — Business logic, services, permissions
graphql/      → TALK     — Hasura queries & mutations via Apollo
types/        → SHAPE    — TypeScript interfaces & enums
hooks/        → REUSE    — Custom client-side hooks
lib/          → UTIL     — Constants, formatters, validators
```

## Products

| Product | Route | Description |
|---------|-------|-------------|
| **Library** | `/dashboard/library` | Manage users, authors, books, reviews, messages |
| **Studio** | `/dashboard/studio` | Manage users, usage, credits, transactions, activity |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_HASURA_GRAPHQL_URL` — your Hasura project endpoint
- `HASURA_ADMIN_SECRET` — Hasura admin secret (server-side only)

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/dashboard`.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 14](https://nextjs.org) | App Router, SSR, API routes |
| [TypeScript](https://typescriptlang.org) | Type safety across the board |
| [Apollo Client](https://apollographql.com) | GraphQL client for Hasura |
| [Hasura](https://hasura.io) | Auto-generated GraphQL API |
| [NextAuth.js](https://next-auth.js.org) | Authentication |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Zod](https://zod.dev) | Schema validation |
| [date-fns](https://date-fns.org) | Date formatting |

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript check without emit
npm run format       # Prettier format
```

---

## Path Aliases

All imports use the `@/` alias pointing to `src/`:

```ts
import { DataTable }  from "@/components/shared/DataTable";
import { useProduct } from "@/hooks/useProduct";
import { cn }         from "@/lib/utils";
import type { Book }  from "@/types/book";
```

---

## Permissions Model

Access control is enforced at two levels:

1. **Route level** — via middleware in `src/features/auth/permissions.ts`
2. **UI level** — via `usePermissions()` hook to conditionally render actions

Roles: `super_admin` · `library_admin` · `library_moderator` · `studio_admin` · `studio_support`
