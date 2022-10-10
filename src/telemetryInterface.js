import { Serial } from 'raspi-serial';
class interfaceSingleton {
  serial = new Serial({
    baudRate: 9600,
    portId: '/dev/ttyS0',
  });
  constructor() {
    this.serial.open(() => {
      serial.on('data', (data) => {
        for (let i = 0; i < data.length; i++) {
          updateCheckBuffer(data[i]);
          if (!transActive) {
            checkStart();
          } else {
            transData.push(data[i]);
            checkEnd();
          }
        }
      });
    });
  }

  checkBuffer = [0, 0];
  endMarker = [0x3d, 0x3d];
  startMarker = [0x3c, 0x3c];
  transActive = false;
  sendLength = 34;
  expected = sendLength - 6;
  transData = [];
  transStartTime = 0;

  telemetryBase = {
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

  telemetry = JSON.parse(JSON.stringify(this.telemetryBase));

  getTelemetry() {
    return this.telemetry;
  }

  to_string(data) {
    let utf8Encode = new TextEncoder();
    return utf8Encode.decode(data);
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
      console.log('Transmission started');
    }
  }

  checkEnd() {
    if (this.transData.length === this.expected) {
      console.log(`Transmission Finished in ${Date.now() - this.transStartTime}ms`);
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
        console.log('Transmission Error');
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

  populateTelemetry() {
    // Convert buffer into data structure

    this.telemetry.flight_state = this.to_int(this.transData.slice(0, 2));
    this.telemetry.altitude = this.to_Float(this.transData.slice(2, 6));
    this.telemetry.velocity = this.to_Float(this.transData.slice(6, 10));
    this.telemetry.linear_acceleration = this.to_Float(this.transData.slice(10, 14));
    this.telemetry.angular_velocity = this.to_Float(this.transData.slice(14, 18));
    this.telemetry.temperature = this.to_int(this.transData.slice(18, 20));
    this.telemetry.pitch = this.to_int(this.transData.slice(20, 22));
    this.telemetry.roll = this.to_int(this.transData.slice(22, 24));
    this.telemetry.yaw = this.to_int(this.transData.slice(24, 26));
    this.telemetry.gps = this.to_string(this.transData.slice(26, 36));
    // console.log(this.telemetry);
    this.transData = [];
    this.telemetry = JSON.parse(JSON.stringify(this.telemetryBase));
  }
}
export default class telemetryInterface {
  constructor() {
    throw new Error('Use Singleton.getInstance()');
  }
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new interfaceSingleton();
    }
    return Singleton.instance;
  }
}
