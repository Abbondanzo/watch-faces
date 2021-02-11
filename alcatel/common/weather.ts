import { receiveMessage, sendMessage } from "./messaging";

export type Condition =
  | "CLEAR_SKY"
  | "FEW_CLOUDS"
  | "SCATTERED_CLOUDS"
  | "BROKEN_CLOUDS"
  | "DRIZZLE"
  | "RAIN"
  | "THUNDERSTORM"
  | "SNOW"
  | "MIST"
  | "UNKNOWN";

export interface WeatherData {
  city: string;
  tempF: number;
  tempC: number;
  condition: Condition;
  timestamp: number; // ISO in seconds
}

const WEATHER_KEY = "WEATHER";
const WEATHER_REQUEST_KEY = "WEATHER_REQUEST";

export const sendWeather = (data: WeatherData) => {
  sendMessage(WEATHER_KEY, data);
};

export const receiveWeather = (callback: (data: WeatherData) => void) => {
  receiveMessage(WEATHER_KEY, callback);
};

export const sendWeatherRequest = () => {
  sendMessage(WEATHER_REQUEST_KEY, null);
};

export const receiveWeatherRequest = (callback: () => void) => {
  receiveMessage(WEATHER_REQUEST_KEY, callback);
};
