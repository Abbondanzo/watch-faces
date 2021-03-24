import { settingsStorage } from "settings";

import {
  DEBUG_KEY,
  DebugLog,
  debugLogsFromString,
  debugLogsToString,
} from "../common/debug";

const MAX_LOGS_LENGTH = 50;

const getLogs = (): DebugLog[] => {
  const value = settingsStorage.getItem(DEBUG_KEY) || "[]";
  const parsed = debugLogsFromString(value);
  if (parsed.length === 0) {
    settingsStorage.setItem(DEBUG_KEY, "[]");
  }
  return parsed;
};

const setLogs = (logs: DebugLog[]) => {
  settingsStorage.setItem(DEBUG_KEY, debugLogsToString(logs));
};

export const debug = (message: string) => {
  const logMessage: DebugLog = [new Date().toLocaleString(), message];
  const newLogs = getLogs();
  if (newLogs.length >= MAX_LOGS_LENGTH) {
    newLogs.shift();
  }
  newLogs.push(logMessage);
  console.log(newLogs);
  setLogs(newLogs);
};
