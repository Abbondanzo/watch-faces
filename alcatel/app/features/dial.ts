import clock, { TickEvent } from "clock";

export interface DialData {
  second: number;
}

class Dial implements Feature<DialData> {
  private callback: Callback<DialData> = () => {};
  private started: boolean;

  constructor() {
    this.started = false;
  }

  initialize(callback: Callback<DialData>) {
    this.callback = callback;
    this.start();
  }

  start() {
    if (!this.started) {
      this.started = true;
      clock.addEventListener("tick", this.tickHandler);
    }
  }

  stop() {
    clock.removeEventListener("tick", this.tickHandler);
    this.started = false;
  }

  private readonly tickHandler = (tickEvent: TickEvent) => {
    // If the granularity is not "seconds", the getSeconds value will be 0
    if (clock.granularity === "seconds") {
      const second = tickEvent.date.getSeconds();
      this.callback({ second });
    }
  };
}

export default new Dial();
