import { me } from "appbit";
import { display } from "display";
import * as fs from "fs";
import { units } from "user-settings";

import {
  Condition,
  receiveWeather,
  sendWeatherRequest,
} from "../../common/weather";

const WEATHER_TYPE = "cbor";
const WEATHER_FILE = "weather.cbor";

export interface WeatherData {
  temperature: string;
  condition: Condition;
}

class Weather implements Feature<WeatherData> {
  private callback: Callback<WeatherData> = () => {};
  private lastWeather: WeatherData;
  private intervalId: number | null = null;
  private enabled = false;

  constructor() {
    this.lastWeather = this.loadWeather();
  }

  initialize(callback: Callback<WeatherData>) {
    this.callback = callback;
    this.callback(this.lastWeather);
    display.addEventListener("change", () => {
      if (display.on) {
        this.start();
      } else {
        this.stop();
      }
    });
    me.addEventListener("unload", this.saveWeather.bind(this));
    receiveWeather((data) => {
      this.lastWeather = {
        temperature:
          units.temperature === "C"
            ? `${Math.round(data.tempC)} C`
            : `${Math.round(data.tempF)} F`,
        condition: data.condition,
      };
      this.callback(this.lastWeather);
    });
    this.start();
  }

  enable() {
    this.enabled = true;
    this.start();
  }

  disable() {
    this.enabled = false;
    this.stop();
  }

  private start() {
    if (!this.intervalId && this.enabled) {
      sendWeatherRequest();
      this.intervalId = setInterval(sendWeatherRequest, 60000); // Request every 60 seconds
    }
  }

  private stop() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  private loadWeather(): WeatherData {
    try {
      const weather = fs.readFileSync(WEATHER_FILE, WEATHER_TYPE);
      for (const weatherKey of Object.keys(this.lastWeather)) {
        if (Object.keys(weather).indexOf(weatherKey) === -1) {
          throw new Error(`Missing key ${weatherKey}`);
        }
      }
      return weather;
    } catch (ex) {
      return {
        temperature: "--",
        condition: "UNKNOWN",
      };
    }
  }

  private saveWeather() {
    fs.writeFileSync(WEATHER_FILE, this.lastWeather, WEATHER_TYPE);
  }
}

export default new Weather();
