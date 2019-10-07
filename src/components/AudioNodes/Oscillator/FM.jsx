import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { setModulationIndex  } from './utils';
import { AM } from './AM';

const FM = ({ oscillator, setValue }) => {
  const { modulationIndex } = oscillator.preset;
  return (
    <>
      <AM oscillator={oscillator} setValue={setValue} />
      <SliderWithLabel onChange={setValue('modulationIndex', setModulationIndex)} label="Modulation index" value={modulationIndex} min={0} max={20} step={1} />
    </>
  )
};

export default FM;