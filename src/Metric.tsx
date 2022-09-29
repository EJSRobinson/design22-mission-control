import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
type MetricProps = {
  value: number;
  unit: string;
};

export default function Metric(props: MetricProps) {
  const { value, unit } = props;
  return (
    <Box component='div' sx={{ pt: 3, pb: 3, pl: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Box component='div' sx={{ fontSize: 80 }}>
            {value}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box component='div' sx={{ fontSize: 20 }}>
            {`  ${unit}`}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
