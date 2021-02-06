import { me } from "appbit";
import clock from "clock";
import { display } from "display";

import Settings from "./settings";

export interface DisplayData {
  on: boolean;
}

class Display implements Feature<DisplayData> {
  private callback: Callback<DisplayData> = () => {};

  initialize(callback: Callback<DisplayData>) {
    this.enableAod();
    this.callback = callback;
    display.addEventListener("change", () => {
      this.callback({ on: display.on });
      this.refresh();
    });
  }

  refresh() {
    clock.granularity =
      display.on && Settings.isSecondsDialEnabled() ? "seconds" : "minutes";
  }

  private enableAod() {
    if (me.permissions.granted("access_aod")) {
      display.aodAllowed = true;
    } else {
      console.log("access_aod permission denied");
    }
  }
}

export default new Display();
