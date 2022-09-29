const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;

const serial = new Serial({
  baudRate: 9600,
  portId: '/dev/ttyS0',
});

let checkBuffer = [0, 0];
let endMarker = [13, 13];
let startMarker = [0x2c, 0x2c];
let transActive = false;
const expected = 6;
let transData = [];

function updateCheckBuffer(val) {
  checkBuffer[0] = checkBuffer[1];
  checkBuffer[1] = val;
}

function checkStart() {
  if (checkBuffer === startMarker) {
    transActive = true;
  }
}

function checkEnd() {
  if (transActive.length === expected) {
    transActive = false;
    if ([transData[transData.length - 2], transData[transData.length - 1]] === endMarker) {
      populateTelemetry();
    }
  }
}

function populateTelemetry() {
  // Convert buffer into data structure
}

serial.open(() => {
  serial.on('data', (data) => {
    // console.log('-----Receiving-----');
    // console.log(`Data Length: ${data.length}`);
    // console.log('RAW:');
    // console.log(data);
    // console.log('----END----');
    // console.log(' ');
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
