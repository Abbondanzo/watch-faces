import { me } from "appbit";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";

export interface HeartRateData {
  bpm: string;
  zone: string;
  restingHeartRate: string;
}

class HeartRate implements Feature<HeartRateData> {
  private callback: Callback<HeartRateData> = () => {};
  private hrm: HeartRateSensor | undefined;
  private lastReading = 0;
  private lastHeartRate = 0;
  private intervalId: number | null = null;

  initialize(callback: Callback<HeartRateData>) {
    const hrm = HeartRateSensor ? new HeartRateSensor() : null;
    if (
      me.permissions.granted("access_heart_rate") &&
      me.permissions.granted("access_user_profile") &&
      hrm
    ) {
      this.callback = callback;
      this.hrm = hrm;
      this.setupEvents();
      this.start();
      if (hrm.timestamp) {
        this.lastReading = hrm.timestamp;
      }
      if (hrm.heartRate) {
        this.lastHeartRate = hrm.heartRate;
      }
    } else {
      console.log("Denied Heart Rate or User Profile permissions");
      callback({
        bpm: "--",
        zone: "denied",
        restingHeartRate: "--",
      });
    }
  }

  private setupEvents() {
    display.addEventListener("change", () => {
      if (display.on) {
        this.start();
      } else {
        this.stop();
      }
    });
  }

  private getReading() {
    let bpm = this.lastHeartRate;
    if (this.hrm?.timestamp !== this.lastReading && this.hrm?.heartRate) {
      this.lastReading = this.hrm?.timestamp || 0;
      this.lastHeartRate = this.hrm.heartRate;
      bpm = this.lastHeartRate;
    }

    this.callback({
      bpm: bpm ? String(bpm) : "--",
      zone: user.heartRateZone(bpm || 0),
      restingHeartRate: user.restingHeartRate
        ? String(user.restingHeartRate)
        : "--",
    });
  }

  private start() {
    if (!this.intervalId) {
      this.hrm?.start();
      this.getReading();
      this.intervalId = setInterval(this.getReading.bind(this), 1000);
    }
  }

  private stop() {
    this.hrm?.stop();
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default new HeartRate();
