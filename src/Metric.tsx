import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
type MetricProps = {
  value: number;
  unit: string;
};

export default function Metric(props: MetricProps) {
  const { value, unit } = props;
  return (
    <Box display='flex' sx={{ pt: 3, pb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box display='flex' justifyContent='flex-end' sx={{ fontSize: 60 }}>
            {value}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='left' sx={{ fontSize: 20 }}>
            {`  ${unit}`}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
