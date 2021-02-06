import { me } from "appbit";
import clock from "clock";
import { today } from "user-activity";

export interface ActivityData {
  steps: string;
  calories: string;
}

class Activity implements Feature<ActivityData> {
  private callback: Callback<ActivityData> = () => {};

  initialize(callback: Callback<ActivityData>) {
    if (me.permissions.granted("access_activity")) {
      this.callback = callback;
      clock.addEventListener("tick", this.tickHandler.bind(this));
    } else {
      console.log("access_activity permission denied");
      callback({
        steps: "--",
        calories: "--",
      });
    }
  }

  private tickHandler() {
    const steps = this.getSteps();
    const calories = this.getCalories();
    this.callback({ steps, calories });
  }

  private getSteps() {
    return this.numberToString(today.adjusted.steps || 0);
  }

  private getCalories() {
    return this.numberToString(today.adjusted.calories || 0);
  }

  private numberToString(num: number): string {
    return num > 999
      ? Math.floor(num / 1000) + "," + ("00" + (num % 1000)).slice(-3)
      : String(num);
  }
}

export default new Activity();
