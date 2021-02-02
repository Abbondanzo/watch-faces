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
const dialCallback = ({ second }: { second: number }) => {
  console.log(second);
  try {
    if (second === 0) {
      for (let i = 0; i < 60; i++) {
        dialDots[i].class = "off";
      }
    }
    for (let i = 0; i < second; i++) {
      dialDots[i].class = "on";
    }
  } catch (err) {
    console.error(err);
  }
};
Dial.initialize(dialCallback);
