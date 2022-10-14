import * as http from 'http';

const tele = {
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

export function getTele() {
  return tele;
}

function fetchTele() {
  http
    .get('http://localhost:3456/fetcher', (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        tele = JSON.parse(chunk.toString());
      });
    })
    .on('error', (err) => {
      console.log('Error: ' + err.message);
    });
}

setInterval(() => {
  fetchTele();
}, 1000);
