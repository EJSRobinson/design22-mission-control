import { useState } from 'react';
import './App.css';
import React, { PureComponent } from 'react';
import Button from '@mui/material/Button';
import PackedLine from './PackedLine';
import Metric from './Metric';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MetricLinePair from './MetricLinePair';

export type numData = {
  time: number;
  value: number;
};

function App() {
  const defaultData: numData[] = [
    { time: 0, value: 0 },
    { time: 1, value: 1 },
  ];
  const [chartData, setChartData] = useState(defaultData);

  const [value, setValue] = useState(0);

  function addNew() {
    const tempChartData = chartData;
    tempChartData.push({
      time: tempChartData[tempChartData.length - 1].time + 1,
      value: Math.random() * 100,
    });
    setChartData(tempChartData);
    setValue(value + 1);
  }

  const long = -8.0114;
  const lat = 39.2577;
  const rr = 1.1;
  const alt = chartData;
  const vel = chartData;
  const acc = chartData;
  const temp = 21;
  const state = 0;

  return (
    <Box width={1400}>
      <Grid container spacing={0} justifySelf='left'>
        <Grid item xs={9}>
          <MetricLinePair series={alt} seriesName={'Altitude'} seriesUnit={'m'} />
          <Button
            onClick={() => {
              addNew();
            }}
          >
            Add Data Point
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Metric value={state} unit='' />
          <Box>
            <Metric value={lat} unit='° Lat' />
            <Metric value={long} unit='° Long' />
          </Box>
          <Metric value={rr} unit='rev/s (Roll)' />
          <Metric value={temp} unit='°C' />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
