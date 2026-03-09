# AGENTS.md

These instructions apply to the entire repository rooted here.

## Core Rules
- Always follow `AGENTS.md` instructions.
- Continue across milestones until project completion or a real blocker.
- Keep `AGENTS.md` updated when new durable instructions or workflow constraints are given.
- Always use `AGENT_MEMORY.md` to store important persistent context and discoveries.
- Update `AGENT_MEMORY.md` whenever new important context is learned or decisions are made.
- Save implementation plans (and other useful plans) in `AGENT_MEMORY.md` when they should persist across sessions.
- Update saved plans as progress changes.
- Move completed/stale plans to an archive section or remove them when they are confirmed no longer needed.
- Make frequent git commits after meaningful progress.
- The frequent-commit rule takes priority over less-frequent commit guidance elsewhere.
- Thorough validation is mandatory at each milestone step: add sufficient tests and run build/unit/integration verification before considering progress complete.
- Use virtual environments when appropriate (e.g., Python tooling/dependencies: `python -m venv .venv`).
- Save notable experiences (what worked, what did not work, and similar learnings) in `AGENTS.md` or `AGENT_MEMORY.md` when appropriate.
- Always document current expected behaviour in repo-facing docs when behavior changes or when user-visible limitations/quirks are clarified.
- Keep `ASSIGNMENT_PROGRESS.md` aligned with the current implementation and deliverable status relative to `ASSIGNMENT.md`.
- Treat severe blockers (missing required toolchains, blocked core commands, and similar hard prerequisites) as stop conditions: report the blocker and wait for resolution instead of proceeding speculatively.
- For large or multi-feature work, make and commit incremental changes as progress is made; do not batch all changes into one final commit.
- Treat `gsplat-viewer/` as read-only reference material. Product work should happen at the repo root; copy/adapt useful files out of `gsplat-viewer/` instead of modifying it in place.
- Keep the `mkkellogg` and `spark` renderer paths in sync for shared app capabilities and behavior changes; when one changes, propagate the corresponding change to the other so both keep working.

## Memory File
- Path: `AGENT_MEMORY.md`
- Purpose: durable handoff context for new or compacted sessions.
- Keep entries concise, factual, and current.
