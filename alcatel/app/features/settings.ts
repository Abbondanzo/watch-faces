import { me } from "appbit";
import * as fs from "fs";

import { receiveSettings } from "./../../common/settings";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

export interface SettingsData {
  secondsDial: boolean;
  backgroundColor: string;
}

class Settings implements Feature<SettingsData> {
  private callback: Callback<SettingsData> = () => {};
  private settings: SettingsData = {
    secondsDial: true,
    backgroundColor: "black",
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

  private loadSettings() {
    try {
      return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    } catch (ex) {
      return {};
    }
  }

  private saveSettings() {
    fs.writeFileSync(SETTINGS_FILE, this.settings, SETTINGS_TYPE);
  }
}

export default new Settings();
