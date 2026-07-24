import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initializeTelemetry } from "./features/app/monitoring/telemetry";
import { AppErrorBoundary } from "./features/app/monitoring/AppErrorBoundary";

initializeTelemetry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>
);
