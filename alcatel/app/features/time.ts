import clock, { TickEvent } from "clock";
import { preferences } from "user-settings";

import { zeroPad } from "./../../common/utils";

export interface TimeData {
  time: string;
  date: string;
}

interface TimeOptions {
  granularity: Granularity;
}

class Time implements Feature<TimeData, TimeOptions> {
  private callback: Callback<TimeData> = () => {};

  initialize(callback: Callback<TimeData>, options?: TimeOptions) {
    clock.granularity = options?.granularity || "minutes";
    this.callback = callback;
    clock.addEventListener("tick", this.tickHandler.bind(this));
  }

  private tickHandler(tickEvent: TickEvent) {
    const time = this.getTime(tickEvent);
    const date = this.getDate(tickEvent);
    this.callback({ time, date });
  }

  private getTime(tickEvent: TickEvent) {
    const today = tickEvent.date;
    const hours = today.getHours();
    let hourString: string;
    if (preferences.clockDisplay === "12h") {
      // 12h format
      hourString = String(hours % 12 || 12);
    } else {
      // 24h format
      hourString = zeroPad(hours);
    }
    const mins = zeroPad(today.getMinutes());
    return `${hourString}:${mins}`;
  }

  private getDate(tickEvent: TickEvent) {
    const today = tickEvent.date;
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    const dayNumber = zeroPad(today.getDate());
    return `${dayName}, ${dayNumber} ${monthName}`;
  }
}

const days = [
  "SUNDAY",
  "MONDAY",
  "TUESAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEPT",
  "OCT",
  "NOV",
  "DEC",
];

export default new Time();
