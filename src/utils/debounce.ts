export default function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  let timer: number;
  return ((...args: any[]) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...args);
    }, delay);
  }) as T;
}
