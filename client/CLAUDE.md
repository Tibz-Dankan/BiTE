# BiTE Frontend — Client

React 19 + TypeScript + Vite SPA for the Bitcoin High School (BiTE) education platform.  
Package manager: **pnpm**. All commands run from `client/`.

## Tech Stack

| Concern | Library | Version |
|---|---|---|
| Framework | React | 19.2.3 |
| Language | TypeScript | 5.8.3 |
| Build | Vite | 7.0.4 |
| Styling | TailwindCSS | 4.1.11 |
| Routing | React Router DOM | 7.10.1 |
| Server state | TanStack React Query | 5.59.20 |
| Client state | Zustand | 5.0.1 |
| Forms | Formik + Yup | 2.4.6 + 1.7.0 |
| UI primitives | Radix UI + Headless UI | Various |
| Rich text | Quill / react-quilljs | 2.0.3 |
| Math | KaTeX | 0.16.27 |
| Chess | chess.js + chessground | 1.4.0 + 10.1.1 |
| Analytics | PostHog JS | 1.347.2 |
| Notifications | react-toastify | 11.0.5 |

## Commands

```bash
pnpm install        # install dependencies
pnpm dev            # start dev server (Vite HMR)
pnpm build          # production build
pnpm preview        # preview production build
```

## Project Structure

```
src/
├── api/            # API client modules (one class per domain)
├── components/
│   ├── layout/     # DashboardLayout and shell components
│   ├── pages/      # Full-page components, organised by domain
│   │   ├── auth/
│   │   ├── common/
│   │   ├── quiz/
│   │   ├── question/
│   │   ├── ranking/
│   │   ├── satsreward/
│   │   ├── user/
│   │   └── categorycertificate/
│   └── ui/         # Reusable, domain-agnostic UI components
├── hooks/          # Custom React hooks
├── providers/      # Context providers (ReactQuery, PostHog)
├── routes/         # Route definitions and renderRoutes helper
├── stores/         # Zustand stores
├── types/          # TypeScript type definitions
├── utils/          # Pure utility functions
└── constants/      # App-wide constants (SERVER_URL, etc.)
```

## Conventions

### Naming
- **Components**: PascalCase files and function names (`QuizCard.tsx`, `AdminDashboard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useQuizTimer.tsx`, `useGetWindowWidth.tsx`)
- **Types**: Prefixed with `T` (`TAuth`, `TQuiz`, `TUser`)
- **API classes**: `*API` suffix (`AuthAPI`, `QuizAPI`)
- **Utilities / non-component files**: camelCase (`formatDate.ts`, `getDeviceInfo.ts`)
- **Zustand stores**: camelCase files (`auth.ts`, `quizAttempt.ts`)

### Types
- Define all shared types in `src/types/`. One file per domain, matching the API domain name.
- Use `T` prefix for all interface/type aliases exported from `types/`.
- Avoid `any`; prefer `unknown` when the shape is truly unknown and narrow it explicitly.

### API Layer (`src/api/`)
- One class per backend domain (e.g., `AuthAPI`, `QuizAPI`).
- Use the `fetch` API; read `SERVER_URL` from `src/constants/urls.ts`.
- Always include `Authorization: Bearer <token>` from the Zustand auth store for protected routes.
- Return typed responses; throw on non-2xx status codes.
- Use `multipart/form-data` when uploading files.

### State Management
- **Server state** (data from the API): TanStack React Query. Use query keys that match the domain and entity ID.
- **Client/UI state**: Zustand stores in `src/stores/`. Use `persist` middleware with `localStorage` only for auth state.
- **Local component state**: `useState` / `useReducer` for ephemeral UI state (modals, form inputs).
- Do not duplicate server state in Zustand stores.

### Routing
- Three route trees: `authRoutes` (unauthenticated), `userRoutes` (`/u/*`), `adminRoutes` (`/a/*`).
- Add routes to the relevant file in `src/routes/`. Use the recursive `renderRoutes` helper.
- Protect routes by placing them inside the appropriate role tree; do not add ad-hoc auth guards inside pages.

### Styling
- TailwindCSS 4 utility classes only. No inline `style` props unless the value is dynamic and cannot be expressed as a Tailwind class.
- Custom design tokens live in `src/index.css` as CSS custom properties using the `oklch` color space.
- For conditional class composition use `clsx` + `tailwind-merge` via `src/utils/classname.ts`.
- Use Radix UI primitives for accessible interactive components (dialogs, dropdowns, selects). Style them with Tailwind; do not add wrapper components solely for styling.

### Forms
- Formik for all non-trivial forms. Define Yup schemas co-located with the form component.
- Keep validation schemas simple and explicit; avoid overly generic reusable schemas.

### Environment Variables
- Prefix all Vite env vars with `VITE_`.
- Access via `import.meta.env.VITE_*`.
- Do not commit real secrets; use `.env.example` as the reference.

```env
VITE_PUBLIC_POSTHOG_KEY=
VITE_PUBLIC_POSTHOG_HOST=
```

### Path Alias
`@/` maps to `src/`. Use it for all non-relative imports.

```ts
import { useAuthStore } from "@/stores/auth";
```

## Key Files

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component; role-based route rendering |
| `src/main.tsx` | React root mounting point |
| `src/constants/urls.ts` | `SERVER_URL` for dev and production |
| `src/stores/auth.ts` | Auth state + token management |
| `src/hooks/useSigninWithRefreshToken.tsx` | JWT refresh polling (10 s interval) |
| `src/routes/renderRoutes.tsx` | Recursive route renderer |
| `src/providers/index.tsx` | Root providers wrapper |

## Do / Don't

**Do**
- Keep pages thin — business logic belongs in hooks or the API layer.
- Co-locate a hook with its page if it is used in exactly one place.
- Use React Query's `staleTime` and `cacheTime` deliberately to avoid unnecessary refetches.
- Add types for every new API response shape in `src/types/`.

**Don't**
- Don't fetch data directly inside page components — use a custom hook that wraps `useQuery`.
- Don't store server-fetched data in Zustand stores.
- Don't introduce new UI component libraries without discussion.
- Don't use `useEffect` for data fetching — React Query handles this.
- Don't bypass the `renderRoutes` pattern by dropping `<Route>` elements ad-hoc in `App.tsx`.
