import express from 'express';
import telemetryInterface from './telemetryInterface.js';
const connection = telemetryInterface.getInstance();

var app = express();
app.listen(3456, () => {
  console.log('Server running on port 3456');
});
app.get('/fetcher', (req, res, next) => {
  res.json(connection.getTelemetry());
});
