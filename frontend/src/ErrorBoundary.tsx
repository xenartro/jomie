import BugsnagPerformance from "@bugsnag/browser-performance";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact, {
  BugsnagErrorBoundary,
} from "@bugsnag/plugin-react";
import React, { ReactNode } from "react";

if (!import.meta.env.DEV) {
  Bugsnag.start({
    apiKey: import.meta.env.VITE_BUGSNAG_KEY,
    plugins: [new BugsnagPluginReact()],
  });
  BugsnagPerformance.start({ apiKey: import.meta.env.VITE_BUGSNAG_KEY });
}

function Noop({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export const ErrorBoundary = import.meta.env.DEV
  ? Noop
  : (Bugsnag.getPlugin("react")?.createErrorBoundary(
      React
    ) as BugsnagErrorBoundary);
