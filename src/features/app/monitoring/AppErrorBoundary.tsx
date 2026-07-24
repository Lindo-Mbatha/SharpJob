import React from "react";
import { captureError } from "./telemetry";

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  correlationId: string | null;
  retryKey: number;
}

export class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    correlationId: null,
    retryKey: 0
  };

  static getDerivedStateFromError(): Partial<AppErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    const correlationId = captureError(error, {
      source: "react.error-boundary",
      component_stack: info.componentStack || "unknown"
    });

    this.setState({ correlationId });
  }

  handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      correlationId: null,
      retryKey: prev.retryKey + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center px-6 text-center bg-slate-50 text-slate-800">
          <div className="max-w-sm space-y-3">
            <h2 className="text-base font-bold">We hit an unexpected error.</h2>
            <p className="text-sm text-slate-600">You can retry without reloading the whole app.</p>
            {this.state.correlationId && (
              <p className="text-xs text-slate-500">Reference: {this.state.correlationId.slice(0, 8)}</p>
            )}
            <button
              type="button"
              onClick={this.handleRetry}
              className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return <React.Fragment key={this.state.retryKey}>{this.props.children}</React.Fragment>;
  }
}
