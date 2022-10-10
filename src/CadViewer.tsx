import React from 'react';
import ReactDOM from 'react-dom';
import { StlViewer } from 'react-stl-viewer';

const url = './src/rocket.stl';

const style = {
  top: 0,
  left: 0,
  width: 215,
  height: 215,
};

export default function CadViewer() {
  return (
    <StlViewer
      style={style}
      modelProps={{
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
      }}
      url={url}
    />
  );
}
