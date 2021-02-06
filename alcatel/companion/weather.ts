import { Condition, sendWeather, WeatherData } from "../common/weather";
import { receiveWeatherRequest } from "./../common/weather";
import { getCurrentLocation } from "./location";

export const initialize = () => {
  const apiKey = "024f07a43db60fe73b53507aa39a8127"; // process.env.API_KEY;
  if (!apiKey) {
    console.log("Missing OpenWeather API key");
    return;
  }
  receiveWeatherRequest(async () => {
    console.log("Received weather request");
    try {
      const location = await getCurrentLocation();
      if (!location) throw new Error("Unable to obtain location");
      const weatherData = await fetchWeather(
        apiKey,
        location.latitude,
        location.longitude
      );
      if (!weatherData) throw new Error("Unable to obtain weather data");
      sendWeather(weatherData);
    } catch (error) {
      console.error("Error responding to weather request:", error.message);
    }
  });
};

// https://openweathermap.org/weather-conditions
const openWeatherIdToCondition = (weatherId: number): Condition => {
  if (200 <= weatherId && weatherId < 300) {
    return "THUNDERSTORM";
  } else if (300 <= weatherId && weatherId < 400) {
    return "DRIZZLE";
  } else if (500 <= weatherId && weatherId < 600) {
    return "RAIN";
  } else if (600 <= weatherId && weatherId < 700) {
    return "SNOW";
  } else if (weatherId === 701) {
    return "MIST";
  } else if (weatherId === 800) {
    return "CLEAR_SKY";
  } else if (weatherId === 801) {
    return "FEW_CLOUDS";
  } else if (weatherId === 802) {
    return "SCATTERED_CLOUDS";
  } else if (weatherId === 803 || weatherId === 804) {
    return "BROKEN_CLOUDS";
  } else {
    return "UNKNOWN";
  }
};

let timeCalculated: number = 0;
let lastWeatherData: WeatherData | null = null;

const fetchWeather = async (
  apiKey: string,
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  // Return the same data if queried 10 minutes ago
  if (new Date().getTime() / 1000 - timeCalculated < 600) {
    console.log("Returning saved weather");
    return lastWeatherData;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lat=${latitude}&lon=${longitude}`;
  console.log(url);

  try {
    const response = await fetch(encodeURI(url));
    const data = await response.json();

    if (!data || data.weather === undefined) {
      throw new Error(data.message || "Weather data missing");
    }

    timeCalculated = data.dt;

    const condition = openWeatherIdToCondition(data.weather[0].id);
    const tempC = data.main.temp - 273.15;
    const tempF = (tempC * 9) / 5 + 32;
    const city = data.name;

    lastWeatherData = { condition, tempC, tempF, city };

    return lastWeatherData;
  } catch (error) {
    console.error(error.message);
    return lastWeatherData;
  }
};
