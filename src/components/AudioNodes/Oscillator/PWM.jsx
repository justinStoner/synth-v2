import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType, setWidth, setModulationFrequency  } from './utils';

export const PWM = ({ oscillator, setValue, hidePartials = false }) => {
  const { modulationFrequency } = oscillator.preset;
  return (
    <>
     <SliderWithLabel onChange={setValue('modulationFrequency', setModulationFrequency)} label="Modulation Frequency" value={modulationFrequency} min={0.1} max={10} step={0.1} />
    </>
  )
};

export default PWM