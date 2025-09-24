// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof globalThis.setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) {
      globalThis.clearTimeout(timer);
    }
    timer = globalThis.setTimeout(() => {
      fn(...args);
    }, wait);
  };
}
