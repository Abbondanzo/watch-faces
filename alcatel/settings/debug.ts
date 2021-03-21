import { DEBUG_KEY, DebugLog, debugLogsFromString } from "../common/debug";

export const getLogs = (settings: any): DebugLog[] => {
  try {
    const logs = debugLogsFromString(settings[DEBUG_KEY]);
    return logs.reverse();
  } catch (_) {
    return [];
  }
};
