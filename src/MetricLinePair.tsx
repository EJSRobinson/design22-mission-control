import PackedLine from './PackedLine';
import Metric from './Metric';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

type props = {
  seriesName: string;
  seriesUnit: string;
  series: {
    time: number;
    value: number;
  }[];
};
export default function MetricLinePair(props: props) {
  const { series, seriesName, seriesUnit } = props;
  return (
    <Box sx={{ m: 1, border: 1, borderRadius: 1, borderColor: '#BBB' }}>
      <Box display='flex' justifyContent='center' sx={{ p: 1, mb: 1, mt: 1, fontSize: 30 }}>
        {seriesName}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box sx={{ mt: 7 }}>
            <Metric
              value={Math.round(series[series.length - 1].value)}
              unit={seriesUnit}
              key={`k_${series.length}`}
            />
          </Box>
        </Grid>
        <Grid item xs={9}>
          <PackedLine
            yunit={`${seriesName} (${seriesUnit})`}
            xunit={'Time (s)'}
            data={series}
            key={`pc_${series.length}`}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
