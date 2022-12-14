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
import { useInterval } from 'usehooks-ts';
import { getTele } from './fetcher.js';

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

type teleType = {
  flight_state: number;
  altitude: number;
  velocity: number;
  linear_acceleration: number;
  angular_velocity: number;
  temperature: number;
  pitch: number;
  roll: number;
  yaw: number;
  gps: string;
};

function App() {
  const defaultData: numData[] = [{ time: 0, value: 0 }];
  const [chartData, setChartData] = useState(defaultData);
  const [altitudeSeries, setAltiudeSeries] = useState(defaultData);
  const [velocitySeries, setVelocitySeries] = useState(defaultData);
  const [accelerationSeries, setAccelerationSeries] = useState(defaultData);

  const [value, setValue] = useState(0);

  const [telemetry, setTelemetry] = useState<teleType>({
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

  useInterval(() => {
    setTelemetry(getTele());
    if (telemetry.flight_state !== 0) {
      setAltiudeSeries([
        ...altitudeSeries,
        {
          time: altitudeSeries[altitudeSeries.length - 1].time + timestep / 1000,
          value: telemetry.altitude,
        },
      ]);
      setVelocitySeries([
        ...velocitySeries,
        {
          time: velocitySeries[velocitySeries.length - 1].time + timestep / 1000,
          value: telemetry.velocity,
        },
      ]);
      setAccelerationSeries([
        ...accelerationSeries,
        {
          time: accelerationSeries[accelerationSeries.length - 1].time + timestep / 1000,
          value: telemetry.linear_acceleration,
        },
      ]);
    }
  }, timestep);

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
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' width={320} justifyContent='center' sx={{ mb: 2, fontSize: 20 }}>
            {`Flight State: ${flightStates[telemetry.flight_state]}`}
          </Box>
          <Box sx={{ m: 1, border: 1, borderRadius: 1, borderColor: '#BBB' }}>
            <Box display='flex' justifyContent='center' sx={{ p: 1, mb: 1, mt: 1, fontSize: 30 }}>
              {'Roll Rate'}
            </Box>
            <Metric value={telemetry.angular_velocity} unit=' Rad/s' />
          </Box>
          <Box sx={{ m: 1, border: 1, borderRadius: 1, borderColor: '#BBB' }}>
            <Box display='flex' justifyContent='center' sx={{ p: 1, mb: 1, mt: 1, fontSize: 30 }}>
              {'Air Temperature'}
            </Box>
            <Metric value={telemetry.temperature} unit='?? C' />
          </Box>
          <Box
            justifyContent='center'
            sx={{ m: 1, border: 1, borderRadius: 1, borderColor: '#BBB' }}
          >
            <Box display='flex' justifyContent='center' sx={{ p: 1, mb: 1, mt: 1, fontSize: 30 }}>
              {'Orientation'}
            </Box>
            <Metric value={telemetry.pitch} unit='??' />
            <Metric value={telemetry.roll} unit='??' />
            <Metric value={telemetry.yaw} unit='??' />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
