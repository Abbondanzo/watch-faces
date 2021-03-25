import { API_KEY } from "./config";
import { initialize as initializeLocation } from "./location";
import { initialize as initializeSettings } from "./settings";
import { initialize as initializeWeather } from "./weather";

initializeLocation();
initializeWeather(API_KEY);
initializeSettings();
