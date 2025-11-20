type Metric = {
  id: string;
  name: string;
  label: "web-vital" | "custom";
  value: number;
};

const REPORT_ENDPOINT = "/api/analytics/performance";

export function reportWebVitals(metric: Metric) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    metric,
    pathname: window.location.pathname,
    timestamp: Date.now(),
  });

  try {
    navigator.sendBeacon?.(REPORT_ENDPOINT, body) ||
      fetch(REPORT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
  } catch (error) {
    console.warn("[perf] Failed to report web vitals", error);
  }
}

