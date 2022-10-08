import { useState } from 'react';
import './App.css';
import React, { PureComponent } from 'react';
import Button from '@mui/material/Button';
import PackedLine from './PackedLine';
import Metric from './Metric';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MetricLinePair from './MetricLinePair';
import CadViewer from './CadViewer';
import telemetryInterface from './telemetryInterface';
import { useInterval } from 'usehooks-ts';

export type numData = {
  time: number;
  value: number;
};

const flightStates = {
  0: 'Pre-Launch',
  1: 'Thrust Phase',
  2: 'Coast Phase',
  3: 'Apogee Detected',
  4: 'Drogue Success',
  5: 'Main Deployed',
  6: 'Main Success',
  7: 'Drogue Failure, Reserve Deployed',
  8: 'Reserve Success',
  9: 'Reserve Failure, Balistic',
  10: 'Main Failure, Reserve Deployed',
  11: 'Reserve Success',
  12: 'Main Fail & Reserve Fail',
  14: 'Landed, Safed in 30secs',
  15: 'Unknown',
};

const timestep = 500;

function App() {
  const defaultData: numData[] = [{ time: 0, value: 0 }];
  const [chartData, setChartData] = useState(defaultData);
  const [altitudeSeries, setAltiudeSeries] = useState(defaultData);
  const [velocitySeries, setVelocitySeries] = useState(defaultData);
  const [accelerationSeries, setAccelerationSeries] = useState(defaultData);

  const [value, setValue] = useState(0);

  const [telemetry, setTelemetry] = useState({
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
  });

  function addNew() {
    const tempChartData = chartData;
    tempChartData.push({
      time: tempChartData[tempChartData.length - 1].time + 1,
      value: Math.random() * 100,
    });
    setChartData(tempChartData);
    setValue(value + 1);
  }

  // const connection = telemetryInterface.getInstance();
  // useInterval(() => {
  //   setTelemetry(connection.getTelemetry());
  //   setAltiudeSeries([
  //     ...altitudeSeries,
  //     {
  //       time: altitudeSeries[altitudeSeries.length - 1].time + timestep / 1000,
  //       value: telemetry.altitude,
  //     },
  //   ]);
  //   setVelocitySeries([
  //     ...velocitySeries,
  //     {
  //       time: velocitySeries[velocitySeries.length - 1].time + timestep / 1000,
  //       value: telemetry.velocity,
  //     },
  //   ]);
  //   setAccelerationSeries([
  //     ...accelerationSeries,
  //     {
  //       time: accelerationSeries[accelerationSeries.length - 1].time + timestep / 1000,
  //       value: telemetry.linear_acceleration,
  //     },
  //   ]);
  // }, timestep);

  return (
    <Box width={1400} justifyContent='left'>
      <Grid container spacing={0}>
        <Grid item xs={9}>
          <MetricLinePair series={altitudeSeries} seriesName={'Altitude'} seriesUnit={'m'} />
          <MetricLinePair series={velocitySeries} seriesName={'Velocity'} seriesUnit={'m/s'} />
          <MetricLinePair
            series={accelerationSeries}
            seriesName={'Acceleration'}
            seriesUnit={'m/s/s'}
          />
          <Button
            onClick={() => {
              addNew();
            }}
          >
            Add Data Point
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' width={320} justifyContent='left' sx={{ mb: 2, fontSize: 20 }}>
            {`Flight State: ${flightStates[telemetry.flight_state]}`}
          </Box>

          <Metric value={telemetry.temperature} unit='°C' />
          <Box>
            <Metric value={0} unit='° Lat' />
            <Metric value={0} unit='° Long' />
          </Box>
          <CadViewer />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
