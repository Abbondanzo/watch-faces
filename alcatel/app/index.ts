import document from "document";

import Activity, { ActivityData } from "./features/activity";
import Dial, { DialData } from "./features/dial";
import Display, { DisplayData } from "./features/display";
import HeartRate, { HeartRateData } from "./features/heart-rate";
import Settings, { SettingsData } from "./features/settings";
import Time, { TimeData } from "./features/time";
import Weather, { WeatherData } from "./features/weather";

/* ================ Display (handles clock granularity) ================ */
const displayCallback = (data: DisplayData) => {
  dialCallback({ second: new Date().getSeconds() });
  toggleDialVisibility(data.on && Settings.isSecondsDialEnabled());
};
Display.initialize(displayCallback);

/* ================ Clock ================ */
const timeText = document.getElementById("time") as TextElement;
const dateText = document.getElementById("date") as TextElement;
const timeCallback = ({ time, date }: TimeData) => {
  timeText.text = time;
  dateText.text = date;
};
Time.initialize(timeCallback);

/* ================ Heart Rate ================ */
const heartRateText = document.getElementById("heart-rate-text") as TextElement;
const heartRateCallback = (data: HeartRateData) => {
  heartRateText.text = data.bpm;
};
HeartRate.initialize(heartRateCallback);

/* ================ Activity ================ */
const activityText = document.getElementById("activity-text") as TextElement;
const activityCallback = (data: ActivityData) => {
  activityText.text = data.steps;
};
Activity.initialize(activityCallback);

/* ================ Seconds Dial ================ */
const dialContainer = document.getElementById("dial") as GroupElement;
const dialDots = dialContainer.getElementsByTagName("circle") || [];
const toggleDialVisibility = (dialEnabled: boolean) => {
  dialContainer.class = dialEnabled ? "" : "hidden";
};
const toggleDial = (dialEnabled: boolean) => {
  toggleDialVisibility(dialEnabled);
  if (dialEnabled) {
    Dial.start();
  } else {
    Dial.stop();
  }
};
const getOpacity = (idx: number, second: number): number => {
  if (second === -1) return 0.2; // Display off
  if (idx < second) return 0.8; // Highlight existing second
  if (idx === second) return 0.4; // Hint the next second
  return 0.2; // Idx not elapsed
};
const dialCallback = ({ second }: DialData) => {
  for (let idx = 0; idx < 60; idx++) {
    dialDots[idx].style.opacity = getOpacity(idx, second);
  }
};
Dial.initialize(dialCallback);

/* ================ Weather ================ */
const weatherContainer = document.getElementById(
  "weather-container"
) as GraphicsElement;
const weatherText = document.getElementById("weather-text") as TextElement;
const weatherImage = document.getElementById("weather-image") as ImageElement;
const toggleWeather = (enabled: boolean) => {
  if (enabled) {
    Weather.enable();
    weatherContainer.style.opacity = 1;
  } else {
    Weather.disable();
    weatherContainer.style.opacity = 0;
  }
};
const weatherCallback = (data: WeatherData) => {
  // Assign text
  weatherText.text = data.temperature;
  // Assign icon
  if (weatherImage) {
    switch (data.condition) {
      case "CLEAR_SKY":
        weatherImage.href = "images/weather/clear_sky.png";
        break;
      case "FEW_CLOUDS":
      case "SCATTERED_CLOUDS":
      case "BROKEN_CLOUDS":
        weatherImage.href = "images/weather/few_clouds.png";
        break;
      case "DRIZZLE":
        weatherImage.href = "images/weather/drizzle.png";
        break;
      case "RAIN":
        weatherImage.href = "images/weather/rain.png";
        break;
      case "THUNDERSTORM":
        weatherImage.href = "images/weather/thunderstorm.png";
        break;
      case "SNOW":
        weatherImage.href = "images/weather/snow.png";
        break;
      case "MIST":
        weatherImage.href = "images/weather/mist.png";
        break;
      case "UNKNOWN":
      default:
        weatherImage.href = "images/weather/unknown.png";
    }
  }
  // Center content
  const boundingBox = weatherContainer.getBBox();
  const trueLeft = boundingBox.left;
  const trueRight = weatherText.getBBox().right;
  const width = trueRight - trueLeft;
  const newX = boundingBox.width / 2 - width / 2;
  weatherContainer.x = newX;
};
Weather.initialize(weatherCallback);

/* ================ Settings ================ */
const background = document.getElementById("background") as RectElement;
const settingsCallback = (data: SettingsData) => {
  toggleDial(data.secondsDial);
  toggleWeather(data.weatherEnabled);
  background.style.fill = data.backgroundColor;
  Display.refresh();
};
Settings.initialize(settingsCallback);
