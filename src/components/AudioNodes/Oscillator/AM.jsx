import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType, setHarmonicity  } from './utils';
import { Osc } from './Osc';

export const AM = ({ oscillator, setValue }) => {
  const { baseType, partialCount, modulationType, harmonicity } = oscillator.preset;
  return (
    <>
      <Osc oscillator={oscillator} setValue={setValue} />
      <FullWidthSelect items={waveFormsDropdownItems} label="Modulation Type" value={modulationType} onChange={setValue('modulationType', setBaseType)} />
      <SliderWithLabel onChange={setValue('harmonicity', setHarmonicity)} label="Harmonicity" value={harmonicity} min={0} max={5} step={0.05} />
    </>
  )
};

export default AM;