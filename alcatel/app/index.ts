import clock from "clock";
import document from "document";

import { getTime } from "./getTime";

// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const time = document.getElementById("time");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  if (time) {
    time.text = getTime(evt);
  }
};
