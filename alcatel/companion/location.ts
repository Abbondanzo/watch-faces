import { geolocation } from "geolocation";

import { debug } from "./debug";

interface Location {
  latitude: number;
  longitude: number;
}

let lastLocation: Location | null = null;

// 30 seconds
const TIMEOUT = 30 * 1000;

export const getCurrentLocation = async (): Promise<Location | null> => {
  return new Promise((resolve) => {
    geolocation.getCurrentPosition(
      (data) => {
        lastLocation = data.coords;
        resolve(lastLocation);
      },
      (error) => {
        resolve(lastLocation);
        const message = `Current position error: ${error.code} ${error.message}`;
        console.error(message);
        debug(message);
      },
      {
        timeout: TIMEOUT,
      }
    );
  });
};
