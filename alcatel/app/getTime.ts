import { TickEvent } from "clock";
import { preferences } from "user-settings";

import { zeroPad } from "./../common/utils";

export const getTime = (tickEvent: TickEvent) => {
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
};
