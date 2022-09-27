import Box from '@mui/material/Box';

type MetricProps = {
  value: number;
  unit: string;
};

export default function Metric(props: MetricProps) {
  const { value, unit } = props;
  return (
    <Box component='div'>
      <Box component='div' sx={{ display: 'inline', fontSize: 80 }}>
        {value}
      </Box>
      <Box component='div' sx={{ display: 'inline', fontSize: 20 }}>
        {`  ${unit}`}
      </Box>
    </Box>
  );
}
