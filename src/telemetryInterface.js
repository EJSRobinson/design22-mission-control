import { Serial } from 'raspi-serial';
class interfaceSingleton {
  constructor() {
    this.serial = new Serial({
      baudRate: 9600,
      portId: '/dev/ttyS0',
    });
    this.serial.open(() => {
      this.serial.on('data', (data) => {
        for (let i = 0; i < data.length; i++) {
          this.updateCheckBuffer(data[i]);
          if (!this.transActive) {
            this.checkStart();
          } else {
            this.transData.push(data[i]);
            this.checkEnd();
          }
        }
      });
    });
    this.checkBuffer = [0, 0];
    this.endMarker = [0x3d, 0x3d];
    this.startMarker = [0x3c, 0x3c];
    this.transActive = false;
    this.sendLength = 34;
    this.expected = this.sendLength - 6;
    this.transData = [];
    this.transStartTime = 0;

    this.telemetryBase = {
      flight_state: 0, //int
      altitude: 0, //float
      velocity: 0, //float
      linear_acceleration: 0, //float
      angular_velocity: 0, //float
      temperature: 0, //int
      pitch: 0, //int
      roll: 0, //int
      yaw: 0, //int
      gps: '', //string
    };

    this.telemetry = JSON.parse(JSON.stringify(this.telemetryBase));
  }

  getTelemetry() {
    return this.telemetry;
  }

  to_Float(data) {
    var buf = new ArrayBuffer(4);
    var view = new DataView(buf);
    data.reverse().forEach(function (b, i) {
      view.setUint8(i, b);
    });
    var num = view.getFloat32(0);
    return num;
  }

  to_int(data) {
    let result = data[1] * 2 ** 8 + data[0];
    return result;
  }

  arraysEqual(a, b) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  updateCheckBuffer(val) {
    this.checkBuffer[0] = this.checkBuffer[1];
    this.checkBuffer[1] = val;
  }

  checkStart() {
    if (this.arraysEqual(this.checkBuffer, this.startMarker)) {
      this.transStartTime = Date.now();
      this.transActive = true;
    }
  }

  checkEnd() {
    if (this.transData.length === this.expected) {
      this.transActive = false;
      if (
        this.arraysEqual(
          [this.transData[this.transData.length - 2], this.transData[this.transData.length - 1]],
          this.endMarker
        )
      ) {
        this.cleanResult();
        this.populateTelemetry();
      } else {
        this.transData = [];
      }
    }
  }

  cleanResult() {
    let tempResult = [];
    for (let i = 0; i < this.transData.length - 2; i++) {
      tempResult.push(this.transData[i]);
    }
    this.transData = tempResult;
  }

  correctAngle(a) {
    if (a > 360) {
      a = a - 2 ** 16;
    }
    return a;
  }

  populateTelemetry() {
    // Convert buffer into data structure

    this.telemetry.flight_state = this.to_int(this.transData.slice(0, 2));
    this.telemetry.altitude = this.to_Float(this.transData.slice(2, 6));
    this.telemetry.velocity = this.to_Float(this.transData.slice(6, 10));
    this.telemetry.linear_acceleration = this.to_Float(this.transData.slice(10, 14));
    this.telemetry.angular_velocity = this.to_Float(this.transData.slice(14, 18));
    this.telemetry.temperature = this.to_int(this.transData.slice(18, 20));
    this.telemetry.pitch = this.correctAngle(this.to_int(this.transData.slice(20, 22)));
    this.telemetry.roll = this.correctAngle(this.to_int(this.transData.slice(22, 24)));
    this.telemetry.yaw = this.correctAngle(this.to_int(this.transData.slice(24, 26)));
    // this.telemetry.gps = this.to_string(this.transData.slice(26, 36));
    // console.log(this.telemetry);
    this.transData = [];
  }
}
export default class telemetryInterface {
  constructor() {
    throw new Error('Use Singleton.getInstance()');
  }
  static getInstance() {
    if (!this.Singleton) {
      this.Singleton = new interfaceSingleton();
    }
    return this.Singleton;
  }
}
