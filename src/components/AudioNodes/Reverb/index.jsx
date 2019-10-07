import React, { useEffect } from 'react';
import Tone from 'tone';
import { SliderWithLabel } from '../../Slider';
import { setRoomsize, setDampening } from './utils';

export const Reverb = ({ preset, tone, setEffect }) => {
  console.log();
  return (
    <>
      <SliderWithLabel
        onChange={setEffect('roomSize', setRoomsize)}
        label="Room size" value={preset.get('roomSize')}
        min={0.01}
        max={1}
        step={0.05}
      />
      <SliderWithLabel
        onChange={setEffect('dampening', setDampening)}
        label="Dampening" value={preset.get('dampening')}
        min={100}
        max={10000}
        step={100}
      />
    </>
  )
};

export default Reverb;