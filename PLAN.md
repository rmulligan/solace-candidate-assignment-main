# Solace Candidate Assignment: Implementation Plan

This document outlines the current state of the application and the next steps to deliver a highly polished solution.

## 1) What’s Done
- End-to-end Next 13 / App Router project scaffold with TypeScript, Tailwind, Drizzle ORM
- `/api/advocates` endpoint with:
  - Server-side search (Drizzle + PostgreSQL + mock fallback)
  - Filtering by multiple specialties (JSONB array ops / in-memory fallback)
  - Pagination + total count
- React `useAdvocates` hook with debounced search & specialty state + pagination
- Core UI components:
  - `SearchBar`, `SpecialtyFilter`, `AdvocateTable` (with skeleton), `Pagination`
  - `AdvocateProfile` modal (detail view)
- Seed + migration scripts via Docker Compose + Drizzle
- Strong TypeScript coverage and type safety across frontend & backend

## 2) Gaps & Next Steps

### A) Polish & Bug-fix
- Add runtime checks around API responses; surface errors in UI
- Verify “no results” & loading states under all edge cases (slow network, empty seed)
- Seed data should include avatar or placeholder images for better visual appeal
- Fix layout issues at extreme breakpoints (very small / very large screens)

### B) UX / Accessibility
- Keyboard & screen-reader support for modal (focus trap, ESC to close)
- ARIA labels on clickable table rows; announce pagination changes
- Ensure contrast ratios meet WCAG 2.1 AA on all text/background pairs
- Mobile-first tweaks: collapse filters & search neatly on narrow viewports

### C) Advanced Features
- Server-side sorting (e.g. by experience, last name) and UI controls
- Multi-column sorting or “group by specialty” view
- “Favorite” or “bookmark” advocates (persisted via cookies/localStorage)
- Export CSV/PDF of current results (print-friendly CSS)

### D) Code Quality & Tests
- Unit tests for `filterAdvocatesMock` & `buildSearchCondition`
- Integration tests for the hook & API (Jest + React Testing Library + MSW)
- End-to-end smoke tests (Cypress) covering search→filter→paginate→profile flow

### E) Documentation & Deployment
- Flesh out README: setup steps, env vars, seed instructions, API examples
- Add OpenAPI/Swagger spec for the advocates API
- GitHub Actions: lint / type-check / test on PRs
- One-click deploy: Vercel preview URLs + Docker deployment for production

### F) Stretch Goals (Optional)
- Dark mode toggle (persisted in localStorage)
- Infinite scroll alternative to pagination
- Real-time updates via WebSockets (“new advocates added” banner)
- GraphQL API layer + Apollo Client + codegen

---
_With this plan in place, the application will be robust, accessible, performant, and well-tested, showcasing a production-ready solution._