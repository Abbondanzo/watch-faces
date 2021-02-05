import { me } from "appbit";
import * as fs from "fs";
import * as messaging from "messaging";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

export interface SettingsData {
  secondsEnabled: boolean;
  backgroundColor: string;
}

class Settings implements Feature<SettingsData> {
  private callback: Callback<SettingsData> = () => {};
  private settings: { [key: string]: string | boolean } = {};

  initialize(callback: Callback<SettingsData>) {
    this.callback = callback;
    this.settings = this.loadSettings();
    this.listenToMessages();
    this.fireCallback();
  }

  private fireCallback() {
    console.log(JSON.stringify(this.settings));
    this.callback({
      secondsEnabled: Boolean(this.settings["secondsDial"]),
      backgroundColor: (this.settings["backgroundColor"] as string) || "black",
    });
  }

  private listenToMessages() {
    messaging.peerSocket.addEventListener("message", (event) => {
      this.settings[event.data.key] = event.data.value;
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
