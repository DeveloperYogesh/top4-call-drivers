let fetchPatched = false;

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const performanceApi = globalThis.performance;
  const originalFetch = globalThis.fetch;

  if (!originalFetch || !performanceApi || fetchPatched) return;
  fetchPatched = true;

  globalThis.fetch = async (...args) => {
    const [resource] = args;
    const url = typeof resource === "string" ? resource : resource?.toString?.() ?? "unknown";
    const start = performanceApi.now();

    try {
      const response = await originalFetch(...args);
      const duration = performanceApi.now() - start;

      if (duration > 500) {
        console.warn(
          `[perf] Slow fetch (${duration.toFixed(1)}ms): ${url} (status: ${response.status})`
        );
      }

      return response;
    } catch (error) {
      console.error(`[perf] Fetch failed: ${url}`, error);
      throw error;
    }
  };
}

