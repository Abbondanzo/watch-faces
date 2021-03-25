import { geolocation, PositionError } from "geolocation";

import { debug } from "./debug";

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

let lastLocation: Location | null = null;

// 10 seconds
const TIMEOUT = 10 * 1000;
// 6 hours
const MAXIMUM_AGE = 6 * 60 * 1000;

const successCallback = (position: Position) => {
  lastLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: position.timestamp,
  };
};

const failureCallback = (error: PositionError) => {
  const message = `Current location error: ${error.code} ${error.message}`;
  console.error(message);
  debug(message);
};

export const initialize = () => {
  geolocation.watchPosition(successCallback, failureCallback, {
    timeout: TIMEOUT,
    maximumAge: MAXIMUM_AGE,
  });
};

const getLastLocation = (): Location | null => {
  if (!lastLocation || !lastLocation.latitude || !lastLocation.longitude) {
    debug("No location saved. Returning null");
    return null;
  }
  // Perform our own timestamp checks
  if (lastLocation.timestamp + MAXIMUM_AGE < new Date().getTime()) {
    debug("Saved location is expired. Returning null");
    return null;
  }
  return lastLocation;
};

export const getCurrentLocation = async (): Promise<Location | null> => {
  if (getLastLocation()) return Promise.resolve(getLastLocation());
  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(
      (position) => {
        successCallback(position);
        resolve(getLastLocation());
      },
      (error) => {
        failureCallback(error);
        reject(error);
      },
      {
        timeout: TIMEOUT,
        maximumAge: MAXIMUM_AGE,
      }
    );
  });
};
