import document from "document";

import Activity, { ActivityData } from "./features/activity";
import Dial, { DialData } from "./features/dial";
import HeartRate, { HeartRateData } from "./features/heart-rate";
import Settings, { SettingsData } from "./features/settings";
import Time, { TimeData } from "./features/time";
import Weather, { WeatherData } from "./features/weather";

/* ================ Clock ================ */
const timeText = document.getElementById("time");
const dateText = document.getElementById("date");

const timeCallback = ({ time, date }: TimeData) => {
  if (timeText) timeText.text = time;
  if (dateText) dateText.text = date;
};
Time.initialize(timeCallback);

/* ================ Heart Rate ================ */
const heartRateText = document.getElementById("heart-rate-text");
const heartRateCallback = (data: HeartRateData) => {
  if (heartRateText) heartRateText.text = data.bpm;
};
HeartRate.initialize(heartRateCallback);

/* ================ Activity ================ */
const stepsText = document.getElementById("steps-text");
const activityCallback = (data: ActivityData) => {
  if (stepsText) stepsText.text = data.steps;
};
Activity.initialize(activityCallback);

/* ================ Seconds Dial ================ */
const dialContainer = document.getElementById("dial");
const dialDots = dialContainer?.getElementsByTagName("circle") || [];
const dialCallback = ({ second }: DialData) => {
  for (let idx = 0; idx < 60; idx++) {
    dialDots[idx].style.opacity = idx <= second ? 0.8 : 0.2;
  }
};
Dial.initialize(dialCallback);

/* ================ Settings ================ */
const background = document.getElementById("background") as RectElement;
const settingsCallback = (data: SettingsData) => {
  if (data.secondsDial) {
    if (dialContainer) dialContainer.class = "";
    Dial.start();
  } else {
    if (dialContainer) dialContainer.class = "hidden";
    Dial.stop();
  }
  background.style.fill = data.backgroundColor;
};
Settings.initialize(settingsCallback);

/* ================ Weather ================ */
const weatherText = document.getElementById("weather-text");
const weatherCallback = (data: WeatherData) => {
  if (weatherText) weatherText.text = data.temperature;
};
Weather.initialize(weatherCallback);
