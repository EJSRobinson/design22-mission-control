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
const expected = 58;
let transData = [];

function updateCheckBuffer(val) {
  checkBuffer[0] = checkBuffer[1];
  checkBuffer[1] = val;
}

function checkStart() {
  if (checkBuffer === startMarker) {
    transActive = true;
    console.log('Transmission started');
  }
}

function checkEnd() {
  if (transActive.length === expected) {
    console.log('Transmission Finished');
    transActive = false;
    if ([transData[transData.length - 2], transData[transData.length - 1]] === endMarker) {
      populateTelemetry();
    }
  }
}

function populateTelemetry() {
  // Convert buffer into data structure
  console.log(transData);
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
