import clock, { TickEvent } from "clock";

interface DialData {
  second: number;
}

class Dial implements Feature<DialData> {
  private callback: Callback<DialData> = () => {};

  initialize(callback: Callback<DialData>) {
    this.callback = callback;
    clock.granularity = "seconds";
    clock.addEventListener("tick", this.tickHandler.bind(this));
  }

  private tickHandler(tickEvent: TickEvent) {
    const second = tickEvent.date.getSeconds();
    this.callback({ second });
  }
}

export default new Dial();
