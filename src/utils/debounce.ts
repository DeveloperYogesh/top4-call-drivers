// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: number | null = null;
  return (...args: Parameters<T>) => {
    if (timer) {
      window.clearTimeout(timer);
    }
    // @ts-ignore
    timer = window.setTimeout(() => {
      fn(...args);
    }, wait);
  };
}
