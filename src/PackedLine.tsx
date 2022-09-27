import { useState } from 'react';
import './App.css';
import React, { PureComponent } from 'react';
import Button from '@mui/material/Button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { numData } from './App';

type PackedLineProps = {
  data: numData[];
  yunit: string;
  xunit: string;
};
export default function PackedLine(props: PackedLineProps) {
  const { data, yunit, xunit } = props;
  console.log(data.length);
  return (
    <>
      <ResponsiveContainer width={800} height={200} key={`rc_${data.length}`}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          key={`lc_${data.length}`}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis type='number' dataKey='time' />
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='value'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
            key={`l_${data.length}`}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
