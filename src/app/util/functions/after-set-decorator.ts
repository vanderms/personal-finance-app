export function createAfterSetDecorator<T extends (...args: any[]) => any>(
  fn: T,
  extra: (result: ReturnType<T>) => void,
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    const result = fn(...args);
    extra(result);
    return result;
  };
}
