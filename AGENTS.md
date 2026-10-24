# AGENTS.md

## Commands

- `npm run dev` — dev server (Turbopack), http://localhost:3000
- `npm run build` — production build; also the closest thing to a typecheck (no separate typecheck script; use `npx tsc --noEmit` if needed)
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, next/core-web-vitals + typescript)
- No test framework is configured. Do not invent test commands.

## Stack / gotchas

- Next.js 16 App Router in `src/app`, React 19, TypeScript strict.
- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`): do not add manual `useMemo`/`useCallback` optimizations or `memo()` wrappers; the compiler handles it.
- **Tailwind v4** — CSS-first config via `src/app/globals.css` (`@theme` etc.); there is no `tailwind.config` file.
- Turbopack loads Tailwind via a `next.config.ts` `turbopack.rules` entry for `*.css`.

## shadcn/ui

- ~70 components are pre-generated in `src/components/ui` (style: `base-nova`, components.json).
- Add missing ones with `npx shadcn@latest add <component>` rather than writing them by hand, so style/aliases match.
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`, `@/lib/utils` → `cn()` helper is in `src/lib/utils.ts`.

## Routes

- App Router pages live in `src/app`: `/add-new-travels`, `/all-destinations`, `/my-bookings`, `/profile`.
- Route group `src/app/(auth)` holds `/sign-in` and `/sign-up` — URLs have **no** `(auth)` segment.
- Repo is client-only (no API routes, no backend code here); root layout uses Geist fonts and never disables the navbar/footer.
