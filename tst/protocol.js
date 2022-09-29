const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;

const serial = new Serial({
  baudRate: 9600,
  portId: '/dev/ttyS0',
});

let checkBuffer = [0, 0];
let endMarker = [0x3d, 0x3d];
let startMarker = [0x3c, 0x3c];
let transActive = false;
const expected = 12 - 6;
let transData = [];

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
    transActive = true;
    console.log('Transmission started');
  }
}

function checkEnd() {
  if (transData.length === expected) {
    console.log('Transmission Finished');
    transActive = false;
    if (
      arraysEqual([transData[transData.length - 2], transData[transData.length - 1]], endMarker)
    ) {
      cleanResult();
      populateTelemetry();
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
        console.log(`Data Length: ${transData.length}`);
        checkEnd();
      }
    }
  });
});
