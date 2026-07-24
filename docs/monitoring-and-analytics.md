# Monitoring and Analytics

This project now includes optional runtime telemetry with two channels:

- Error monitoring via Sentry (`@sentry/react`)
- Product analytics via Google Analytics (`gtag`)

Implementation entry points:
- Initialization and event API: `src/features/app/monitoring/telemetry.ts`
- Bootstrapping and React error boundary: `src/main.tsx`
- Retryable app crash boundary: `src/features/app/monitoring/AppErrorBoundary.tsx`
- App-level interaction tracking: `src/App.tsx`

## Environment Variables

Add these in your environment when you want telemetry enabled:

- `VITE_SENTRY_DSN` - Sentry DSN for exception monitoring
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 measurement id

If either variable is missing, that channel is automatically disabled.

## Tracked Events (Current)

- `screen_view` when user lands on a tab
- `tab_switch` for bottom-nav navigation
- `job_opened` when a listing is opened
- `job_save_toggle` for save/unsave actions
- `job_apply_outbound` when user starts external apply flow
- `apply_submitted` when user submits an application from the wizard
- `profile_saved` when user saves profile changes
- `advanced_search_applied` when advanced filters are applied

## Notes

- Telemetry is disabled in test mode to keep tests deterministic.
- Global `error` and `unhandledrejection` are captured and routed to Sentry when configured.
- Every captured error is stamped with a correlation id (`correlation_id`) for support/debug linking.
- Recoverable async failures use safe user notifications with a short reference id while full details are captured to monitoring.
- App-wide fallback screen now offers a Retry action (no full reload required).
- `Rate SharpJob` now attempts in-app review first, then falls back to native store open, then a Play URL fallback.
