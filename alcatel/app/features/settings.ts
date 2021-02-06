import { me } from "appbit";
import * as fs from "fs";

import { receiveSettings } from "./../../common/settings";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

export interface SettingsData {
  secondsDial: boolean;
  backgroundColor: string;
  weatherEnabled: boolean;
}

class Settings implements Feature<SettingsData> {
  private callback: Callback<SettingsData> = () => {};
  private settings: SettingsData = {
    secondsDial: true,
    backgroundColor: "black",
    weatherEnabled: true,
  };

  initialize(callback: Callback<SettingsData>) {
    this.callback = callback;
    this.settings = this.loadSettings();
    this.listenToMessages();
    this.fireCallback();
  }

  private fireCallback() {
    this.callback(this.settings);
  }

  private listenToMessages() {
    receiveSettings((data) => {
      this.settings[data.key] = data.value;
      this.fireCallback();
    });

    me.addEventListener("unload", this.saveSettings.bind(this));
  }

  private loadSettings(): SettingsData {
    try {
      const settings = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
      for (const settingsKey of Object.keys(this.settings)) {
        if (Object.keys(settings).indexOf(settingsKey) === -1) {
          throw new Error(`Missing key ${settingsKey}`);
        }
      }
      return settings;
    } catch (ex) {
      return {
        secondsDial: true,
        backgroundColor: "black",
        weatherEnabled: true,
      };
    }
  }

  private saveSettings() {
    fs.writeFileSync(SETTINGS_FILE, this.settings, SETTINGS_TYPE);
  }
}

export default new Settings();
