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
const dialCallback = ({ second }: DialData) => {
  for (let idx = 0; idx < 60; idx++) {
    dialDots[idx].style.opacity = idx <= second ? 0.8 : 0.2;
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
