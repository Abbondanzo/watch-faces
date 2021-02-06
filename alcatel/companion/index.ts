import { API_KEY } from "./config";
import { initialize as initializeSettings } from "./settings";
import { initialize as initializeWeather } from "./weather";

initializeWeather(API_KEY);
initializeSettings();
