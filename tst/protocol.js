import { Serial } from 'raspi-serial';

const serial = new Serial({
  baudRate: 9600,
  portId: '/dev/ttyS0',
});

let checkBuffer = [0, 0];
const endMarker = [0x3d, 0x3d];
const startMarker = [0x3c, 0x3c];
let transActive = false;
const sendLength = 34;
const expected = sendLength - 6;
let transData = [];
let transStartTime = 0;

const telemetryBase = {
  flight_state: 0, //int
  altitude: 0, //float
  velocity: 0, //float
  linear_acceleration: 0, //float
  angular_velocity: 0, //float
  temperature: 0, //int
  pitch: 0, //int
  roll: 0, //int
  yaw: 0, //int
};

let telemetry = JSON.parse(JSON.stringify(telemetryBase));

function to_Float(data) {
  var buf = new ArrayBuffer(4);
  var view = new DataView(buf);
  data.reverse().forEach(function (b, i) {
    view.setUint8(i, b);
  });
  var num = view.getFloat32(0);
  return num;
}

function to_int(data) {
  let result = data[1] * 2 ** 8 + data[0];
  return result;
}

function arraysEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function updateCheckBuffer(val) {
  checkBuffer[0] = checkBuffer[1];
  checkBuffer[1] = val;
}

function checkStart() {
  if (arraysEqual(checkBuffer, startMarker)) {
    transStartTime = Date.now();
    transActive = true;
    console.log('Transmission started');
  }
}

function checkEnd() {
  if (transData.length === expected) {
    console.log(`Transmission Finished in ${Date.now() - transStartTime}ms`);
    transActive = false;
    if (
      arraysEqual([transData[transData.length - 2], transData[transData.length - 1]], endMarker)
    ) {
      cleanResult();
      populateTelemetry();
    } else {
      console.log('Transmission Error');
      transData = [];
    }
  }
}

function cleanResult() {
  let tempResult = [];
  for (let i = 0; i < transData.length - 2; i++) {
    tempResult.push(transData[i]);
  }
  transData = tempResult;
}

function populateTelemetry() {
  // Convert buffer into data structure

  telemetry.flight_state = to_int(transData.slice(0, 2));
  telemetry.altitude = to_Float(transData.slice(2, 6));
  telemetry.velocity = to_Float(transData.slice(6, 10));
  telemetry.linear_acceleration = to_Float(transData.slice(10, 14));
  telemetry.angular_velocity = to_Float(transData.slice(14, 18));
  telemetry.temperature = to_int(transData.slice(18, 20));
  telemetry.pitch = to_int(transData.slice(20, 22));
  telemetry.roll = to_int(transData.slice(22, 24));
  telemetry.yaw = to_int(transData.slice(24, 26));
  console.log(telemetry);
  transData = [];
  telemetry = JSON.parse(JSON.stringify(telemetryBase));
}

serial.open(() => {
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
