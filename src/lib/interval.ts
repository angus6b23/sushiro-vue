export class Interval {
  intervalId: number;
  callback: (...arg: any[]) => any;
  timeout: number;

  constructor(callback: (...arg: any[]) => any, timeout: number) {
    this.callback = callback;
    this.timeout = timeout;
    this.intervalId = setInterval(callback, timeout);
  }
  clear = () => {
    clearInterval(this.intervalId);
  };
  reset = () => {
    this.clear();
    this.intervalId = setInterval(this.callback, this.timeout);
  };
}
