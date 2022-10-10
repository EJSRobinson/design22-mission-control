const connection = telemetryInterface.getInstance();

setInterval(() => {
  console.log(connection.getTelemetry());
}, 1000);
