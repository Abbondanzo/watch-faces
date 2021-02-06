import { receiveMessage, sendMessage } from "./messaging";

export interface SettingsData {
  key: string;
  value: string | boolean;
}

const SETTINGS_KEY = "SETTINGS";

export const sendSettings = (data: SettingsData) => {
  sendMessage(SETTINGS_KEY, data);
};

export const receiveSettings = (callback: (data: SettingsData) => void) => {
  receiveMessage(SETTINGS_KEY, callback);
};
