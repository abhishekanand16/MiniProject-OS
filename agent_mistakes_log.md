# Agent Mistakes Log

## Purpose

Track implementation mistakes and their fixes so future agents do not repeat them.

## Entries

### 2026-04-21

- Mistake: The original project plan mixed UI work with simulation-engine work.
  - Fix: This build was kept strictly UI/UX-only. All rendered content was moved to `components/simulation/mock-data.ts`, and no reducer, policy, backend, or engine files were introduced.

- Mistake: The generated npm baseline started as a generic package instead of a Next.js app setup.
  - Fix: `package.json` was updated with proper Next.js scripts and the project was scaffolded manually with App Router config files.

- Mistake: The requested root-level execution guidance was not initially stored in the repository root.
  - Fix: Root documentation now lives in `README.md`, and this log exists in the root so future agents have immediate guidance before continuing.

- Mistake: Next.js initially warned about the wrong workspace root because another lockfile existed higher in the filesystem.
  - Fix: `next.config.ts` now sets `turbopack.root` to this repository so builds resolve the intended project root cleanly.

- Mistake: The project previously stopped at UI-only scaffolding, leaving the simulation engine, policies, APIs, persistence, and integration incomplete.
  - Fix: Added `engine/`, `app/api/simulation/`, `lib/simulation/`, `lib/persistence/`, and `context/SimulationContext.tsx` so the UI binds to deterministic backend-driven state.

- Mistake: Earlier docs implied backend logic was intentionally absent after UI completion.
  - Fix: Rewrote `README.md` with architecture, API contracts, test instructions, and extension points for full project handoff.

- Mistake: In fullscreen layouts, the three-column simulation section stretched all cards to the height of the tallest column (`ThreadList`), leaving large empty areas in queue and database panels.
  - Fix: Updated the grid container to `items-start` in `components/simulation/SimulationDashboard.tsx` and removed `min-h-full`/`h-full` wrappers from `QueueView`, `DatabaseView`, and `ThreadList` so each panel keeps content-driven height.

### 2026-05-18

- Mistake: The auto-run `setInterval` in `SimulationContext` depended on a `step` callback whose identity changed whenever `state` changed, so the interval was torn down and recreated every tick. That produced uneven timing and unnecessary work.
  - Fix: Keep latest `SimulationState` and policy mode in refs, implement `step` with `useCallback` and an empty dependency array, and use a `stepInFlightRef` guard so overlapping requests cannot stack when the user spams Step or the network is slow.

- Mistake: `Run` could be enabled before `/api/simulation/init` finished, so `start` could turn on the interval while `state` was still null and steps silently no-op until load completed.
  - Fix: Expose `isReady` from context (`state !== null`), disable Run/Step until ready, and make `start` bail out if `stateRef` is still empty.

- Mistake: Assigning `stateRef.current = state` and `modeRef.current = mode` during render tripped the `react-hooks/refs` ESLint rule ("Cannot access refs during render") on newer React lint configs.
  - Fix: Sync both refs from a `useEffect` that depends on `[state]` and `[mode]` (two effects), while still setting `modeRef.current` synchronously inside `setMode` so policy changes apply before the next render when needed.

- Mistake: `ControlPanel` copy still described controls as "UI-only" and unrelated to scheduling, which contradicted the wired API integration.
  - Fix: Removed that misleading copy and simplified control labels to Run / Pause / Step / Reset with short policy names (Readers first / Writers first / Fair).
