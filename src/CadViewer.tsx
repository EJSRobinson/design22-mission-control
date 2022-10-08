import React from 'react';
import ReactDOM from 'react-dom';
import { StlViewer } from 'react-stl-viewer';

const url = './rocket.stl';

const style = {
  top: 0,
  left: 0,
  width: 200,
  height: 200,
};

export default function CadViewer() {
  return (
    <StlViewer
      style={style}
      orbitControls
      modelProps={{
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
      }}
      shadows
      url={url}
    />
  );
}
