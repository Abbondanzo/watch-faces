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
  toggleDialVisibility(data.on);
};
Display.initialize(displayCallback);

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
const toggleDialVisibility = (dialEnabled: boolean) => {
  if (dialContainer) dialContainer.class = dialEnabled ? "" : "hidden";
};
const toggleDial = (dialEnabled: boolean) => {
  toggleDialVisibility(dialEnabled);
  if (dialEnabled) {
    Dial.start();
  } else {
    Dial.stop();
  }
};
const dialCallback = ({ second }: DialData) => {
  for (let idx = 0; idx < 60; idx++) {
    dialDots[idx].style.opacity = idx <= second ? 0.8 : 0.2;
  }
};
Dial.initialize(dialCallback);

/* ================ Weather ================ */
const weatherText = document.getElementById("weather-text") as TextElement;
const weatherImage = document.getElementById("weather-image") as ImageElement;
const toggleWeather = (enabled: boolean) => {
  if (enabled) {
    Weather.enable();
    weatherText.style.opacity = 1;
    weatherImage.style.opacity = 1;
  } else {
    Weather.disable();
    weatherText.style.opacity = 0;
    weatherImage.style.opacity = 0;
  }
};
const weatherCallback = (data: WeatherData) => {
  if (weatherText) weatherText.text = data.temperature;
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
