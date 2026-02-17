# Specification

## Summary
**Goal:** Restore a working frontend boot by introducing a new entry module that mounts the existing app with the same provider wiring, then cleanly rebuild and redeploy without changing existing pages/components.

**Planned changes:**
- Add a new frontend entry file under `frontend/src/` that mounts to `<div id="root"></div>`, renders the existing `App` component unchanged, and preserves the current provider setup (React Query `QueryClientProvider` + `InternetIdentityProvider`) currently done in `frontend/src/main.tsx`.
- Update `frontend/index.html` to load the new entry module instead of `/src/main.tsx`, keeping the root mount element unchanged.
- Perform a clean rebuild and redeploy to ensure the frontend compiles without errors and no longer boots to a blank/failed screen.

**User-visible outcome:** The deployed app loads successfully (not blank) and existing routes/pages (e.g., `/landing`, `/home`) render as before, with auth and actor-dependent hooks continuing to work.
