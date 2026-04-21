# MiniProject-OS

## Readers-Writers UI Prototype

This repository currently contains a UI/UX-only prototype for a Readers-Writers simulator.
It is intentionally limited to the front-end presentation layer so future contributors can
connect a simulation engine without redesigning the interface.

## Current Scope

- In scope:
  - Next.js App Router UI
  - Responsive dashboard layout
  - Mock data for queue, threads, logs, and stats
  - Interaction polish, dark theme, and accessibility-focused controls
- Out of scope:
  - Scheduling logic
  - Reducers, policies, and synchronization engine
  - Backend/API work
  - Persistence and algorithm correctness tests

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

## Project Structure

- `app/` - route entry and layout
- `components/simulation/` - dashboard sections and static mock-driven UI
- `components/ui/` - reusable design primitives
- `styles/` - global theme and visual tokens
- `lib/` - shared utilities

## Handoff Notes

- All sample content comes from `components/simulation/mock-data.ts`.
- UI interaction state is local and presentation-only.
- Future engine work should replace mock data via props, context, or an engine adapter without changing the visual component contracts.
- Check `agent_mistakes_log.md` before continuing implementation so repeated mistakes are avoided.