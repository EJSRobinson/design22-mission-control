import { useState } from 'react';
import './App.css';
import React, { PureComponent } from 'react';
import Button from '@mui/material/Button';
import PackedLine from './PackedLine';
import Metric from './Metric';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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

  return (
    <div>
      <Grid container spacing={10}>
        <Grid item xs={6}>
          <Box>
            <Grid container spacing={0}>
              <Grid item xs={2}>
                <Box sx={{ mt: 9 }}>
                  <Metric
                    value={Math.round(alt[alt.length - 1].value)}
                    unit='m'
                    key={`k_${alt.length}`}
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <PackedLine
                  yunit={'Altiude (m)'}
                  xunit={'Time (s)'}
                  data={alt}
                  key={`pc_${alt.length}`}
                />
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={2}>
                <Box sx={{ mt: 9 }}>
                  <Metric
                    value={Math.round(vel[vel.length - 1].value)}
                    unit='m/s'
                    key={`k_${vel.length}`}
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <PackedLine
                  yunit={'Velocity (m/s)'}
                  xunit={'Time (s)'}
                  data={vel}
                  key={`pc_${vel.length}`}
                />
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={2}>
                <Box sx={{ mt: 9 }}>
                  <Metric
                    value={Math.round(acc[acc.length - 1].value)}
                    unit='m/s/s'
                    key={`k_${acc.length}`}
                  />
                </Box>
              </Grid>
              <Grid item xs={10}>
                <PackedLine
                  yunit={'Acceleration (m/s/s)'}
                  xunit={'Time (s)'}
                  data={acc}
                  key={`pc_${acc.length}`}
                />
              </Grid>
            </Grid>
          </Box>
          <Button
            onClick={() => {
              addNew();
            }}
          >
            Add Data Point
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Metric value={lat} unit='° Lat' />
            <Metric value={long} unit='° Long' />
          </Box>
          <Metric value={rr} unit='rev/s (Roll)' />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
