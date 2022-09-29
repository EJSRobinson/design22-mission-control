const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;

const serial = new Serial({
  baudRate: 9600,
  portId: '/dev/ttyS0',
});

let checkBuffer = [0, 0];
const endMarker = [0x3d, 0x3d];
const startMarker = [0x3c, 0x3c];
let transActive = false;
const sendLength = 16;
const expected = sendLength - 6;
let transData = [];
let transStartTime = 0;

function to_Float(data) {
  var buf = new ArrayBuffer(4);
  var view = new DataView(buf);
  data.reverse().forEach(function (b, i) {
    view.setUint8(i, b);
  });
  var num = view.getFloat32(0);
  return num;
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
  console.log(transData);
  // console.log(to_Float(transData));
  transData = [];
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
