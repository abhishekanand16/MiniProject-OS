# MiniProject-OS

## Readers-Writers Simulator

This repository now includes a full Readers-Writers simulator implementation with:
- deterministic simulation engine
- pluggable scheduling policies (`readerPriority`, `writerPriority`, `fair`)
- validated API endpoints for simulation lifecycle
- live UI integration through context and backend fetches
- run history/event persistence in a process-local store
- unit and service integration tests

## Architecture Overview

- `engine/`
  - `types.ts`: canonical domain models for threads, lock state, events, config, and simulation state
  - `simulationEngine.ts`: pure tick advancement (`initializeSimulation`, `advanceSimulation`, `deriveStats`)
  - `policies/`: policy modules and dispatcher (`readerPriority`, `writerPriority`, `fair`)
- `lib/simulation/`
  - `validators.ts`: request/contract validation
  - `service.ts`: simulation lifecycle orchestration and guardrails
- `lib/persistence/`
  - `runStore.ts`: in-memory simulation state/event history persistence
- `app/api/simulation/`
  - lifecycle and retrieval API routes
- `context/SimulationContext.tsx`
  - UI integration bridge mapping backend snapshots to existing visual components
- `tests/`
  - policy/engine tests and API service contract tests

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

## Run Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## API Contract Examples

- `POST /api/simulation/init`
  - body: `{ "mode": "fair", "seed": 42, "threads": [{ "id": "R1", "role": "reader", "arrivalTick": 1, "duration": 3 }] }`
  - returns: `{ "simulation": { ...state } }`
- `POST /api/simulation/step`
  - body: `{ "simulationId": "<id>", "tickDelta": 1, "mode": "fair" }`
- `POST /api/simulation/run`
  - body: `{ "simulationId": "<id>", "ticks": 15 }`
- `POST /api/simulation/reset`
  - body: `{ "simulationId": "<id>" }`
- `GET /api/simulation/:id/snapshot`
  - returns latest state snapshot
- `GET /api/simulation/:id/logs`
  - returns event stream for timeline/replay

## Test and Validation

```bash
npm run lint
npm run test
```

Test coverage includes:
- policy behavior and transition correctness
- invariant enforcement (mutual exclusion and fair starvation threshold)
- service-level lifecycle/contract behavior

## Known Limitations and Extension Points

- persistence is in-memory and process-local by default; file/DB storage can be added under `lib/persistence/`
- run execution currently uses request-driven stepping plus client interval control
- API auth/rate limiting is not included because this is a lab simulator environment