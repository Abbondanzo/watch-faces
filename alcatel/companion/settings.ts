import * as messaging from "messaging";
import { settingsStorage } from "settings";

export const initialize = () => {
  settingsStorage.addEventListener("change", (evt) => {
    if (evt.key && evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
};

const sendValue = (key: string, val: string | null) => {
  if (val) {
    sendSettingData({
      key,
      value: JSON.parse(val),
    });
  }
};

const sendSettingData = (data: any) => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
};
