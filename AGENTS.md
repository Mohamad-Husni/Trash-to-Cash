<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project: Bincoin — Smart Waste Management PWA

### Build & Dev Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — eslint

### Architecture
- **Framework**: Next.js 16 App Router, TypeScript, Tailwind v4, Shadcn UI (base-ui)
- **State**: Zustand + persist (LocalStorage) for auth/data, TanStack Query for data fetching
- **Maps**: `@react-google-maps/api` with SVG fallback (set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`)
- **PWA**: Manual manifest + service worker (registered in production only)

### Key Patterns
- All data access goes through `lib/hooks/*` → `lib/store/data-store.ts` (Zustand). This is the Supabase migration seam.
- Auth via `lib/store/auth-store.ts` (Zustand + persist). Guards in `components/guards/`.
- Point calculation: pure function in `lib/points.ts` — `calcPoints()`.
- Base-ui components use `render` prop instead of `asChild`. Select `onValueChange` passes `string | null`.

### Roles
- `citizen` → `/citizen/*` (dashboard, book-pickup, request-status, wallet)
- `collector` → `/collector/*` (pending-approval, dashboard, active-job, history)
- `admin` → `/admin/*` (dashboard, collectors, audit-log, bins, settings)

### Access Control
- Role and permission guards live in `components/guards/` and use `lib/access.ts`.
- `RoleGuard` redirects unallowed roles to their safe dashboard.
- `PermissionGuard` enforces granular permissions by role; pending collectors are denied collector routes.

### Mobile & Maps
- Viewport allows user scaling. Use responsive Tailwind classes (`sm:`, `md:`) for layouts.
- Map heights should be responsive: `h-[300px] sm:h-[400px] md:h-[500px]`.
- Google Maps loads when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set; otherwise a placeholder grid is shown.
