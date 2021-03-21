export const DEBUG_KEY = "debugLogs";

type DateString = string;
type Message = string;
export type DebugLog = [DateString, Message];

export const debugLogsToString = (logs: DebugLog[]): string => {
  return JSON.stringify(logs);
};

export const debugLogsFromString = (logs: string): DebugLog[] => {
  try {
    const parsed = JSON.parse(logs);
    if (!Array.isArray(parsed)) throw new Error("Logs are not a valid array");
    if (!parsed.every((item) => item.length === 2))
      throw new Error("Logs not valid shape");
    return parsed;
  } catch (_) {
    return [];
  }
};
