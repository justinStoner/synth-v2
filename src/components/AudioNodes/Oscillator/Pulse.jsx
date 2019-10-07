import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType, setWidth  } from './utils';

export const Pulse = ({ oscillator, setValue, hidePartials = false }) => {
  const { width } = oscillator.preset;
  return (
    <>
     <SliderWithLabel onChange={setValue('width', setWidth)} label="Width" value={width} min={0.00} max={1} step={0.05} />
    </>
  )
};

export default Pulse;