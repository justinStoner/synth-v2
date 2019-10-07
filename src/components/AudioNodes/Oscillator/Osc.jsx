import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType  } from './utils';

export const Osc = ({ oscillator, setValue, hidePartials = false }) => {
  const { baseType, partialCount } = oscillator.preset;
  return (
    <>
      <FullWidthSelect items={waveFormsDropdownItems} label="Type" value={baseType} onChange={setValue('baseType', setBaseType)} />
     {!hidePartials && <SliderWithLabel onChange={setValue('partialCount', setPartialCount)} label="Partial Count" value={partialCount} min={0} max={32} step={1} />}
    </>
  )
};

export default Osc;