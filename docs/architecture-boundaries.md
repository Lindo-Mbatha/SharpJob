# Architecture Boundaries

Purpose: keep the app modular and prevent logic drift back into a monolithic App component.

## 1) What belongs in App

`src/App.tsx` is the composition root only.

Allowed in App:
- Wire domain hooks and selectors together.
- Hold short-lived view orchestration state (for example active tab, open/close flags, selected ids).
- Connect user intents from UI components to hook actions.
- Pass props to feature components.

Not allowed in App:
- Business rules and domain transitions.
- Data derivation logic that can be pure (filtering, counting, pagination, profile strength, unread count).
- Reusable side-effect logic (timers, lifecycle sync, notification plumbing).

Rule of thumb:
- If logic is testable without rendering the whole app, move it into a hook action or selector.

## 2) Hook ownership boundaries

Hooks are domain owners and define state + actions contracts.

Ownership map:
- `src/features/app/hooks/useAlerts.ts`
  - Owns notifications/alerts state transitions and alert-related actions.
- `src/features/app/hooks/useApplyFlow.ts`
  - Owns apply wizard state machine and apply submission side effects.
- `src/features/app/hooks/useJobActions.ts`
  - Owns job action transitions (save/apply/share/opening interactions).
- `src/features/app/hooks/useExploreFilters.ts`
  - Owns explore and advanced-search input/filter state transitions.
- `src/features/app/hooks/useProfileSettings.ts`
  - Owns profile/settings/preferences editable state.
- `src/features/app/hooks/useDeviceStatus.ts`
  - Owns device/time/network/battery state lifecycle.

Hook contract rule:
- Public API should remain `{ state, actions }`.
- Components call actions; components do not mutate domain structures directly.

## 3) Allowed cross-domain dependencies

Allowed dependency direction:
- `tabs/*` -> `app/types` + selectors + props/actions from App
- `App.tsx` -> hooks + selectors + tabs/components
- `hooks/*` -> shared domain types + local utilities
- `selectors.ts` -> domain types only (pure, no React, no side effects)

Disallowed dependency direction:
- `hooks/*` importing tab UI components.
- `selectors.ts` importing React hooks or UI modules.
- Domain hooks directly importing sibling domain hooks unless explicitly designated as orchestrator.
- `tabs/*` bypassing App by directly mutating global domain state.

## 4) Regression guardrails

Before merging changes:
- New behavior should be covered by integration or action-level tests.
- New derivation logic should be extracted to selectors and tested as pure functions.
- Any increase in App complexity must be justified (temporary orchestration only) and reduced in follow-up.

CI policy alignment:
- Lint + typecheck + tests + coverage gates enforce this structure.
- Moving baseline coverage check prevents silent quality drift over time.
