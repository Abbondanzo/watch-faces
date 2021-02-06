import { settingsStorage } from "settings";

import { sendSettings } from "./../common/settings";

export const initialize = () => {
  settingsStorage.addEventListener("change", (evt) => {
    if (evt.key && evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
};

const sendValue = (key: string, val: string | null) => {
  if (val) {
    sendSettings({
      key,
      value: JSON.parse(val),
    });
  }
};
