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
