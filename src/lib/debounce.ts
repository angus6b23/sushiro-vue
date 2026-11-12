export const debounce = <T>(
  callback: (...args: any[]) => T | Promise<T>,
  delay: number,
) => {
  let timeout: number;
  return (...args: any[]): any => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(args);
    }, delay);
  };
};
