import document from "document";

import Time from "./features/time";
import Dial from "./features/dial";

/* ================ Clock ================ */
const timeText = document.getElementById("time");
const dateText = document.getElementById("date");

const timeCallback = ({ time, date }: { time: string; date: string }) => {
  if (timeText) timeText.text = time;
  if (dateText) dateText.text = date;
};
Time.initialize(timeCallback);

/* ================ Seconds Dial ================ */
const dialContainer = document.getElementById("dial");
const dialDots = dialContainer?.getElementsByTagName("circle") || [];
const resetDots = () => {
  dialDots.forEach((dialDot) => {
    dialDot.style.opacity = 0.2;
  });
};
const dialCallback = ({ second }: { second: number }) => {
  // Register second 0 separate from loop, reset on second 1
  if (second === 0) {
    dialDots[0].style.opacity = 0.8;
  } else if (second === 1) {
    resetDots();
  }
  // Ensure that all second dots are set correctly
  for (let i = 1; i <= second; i++) {
    dialDots[i].style.opacity = 0.8;
  }
};
Dial.initialize(dialCallback);

/* ================ Activity ================ */
// TODO: Write
