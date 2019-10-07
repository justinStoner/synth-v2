import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType, setHarmonicity, setSpread, setCount  } from './utils';
import { Osc } from './Osc';

export const Fat = ({ oscillator, setValue }) => {
  const { spread, count } = oscillator.preset;
  return (
    <>
      <Osc oscillator={oscillator} setValue={setValue} />
      <SliderWithLabel onChange={setValue('spread', setSpread)} label="Spread" value={spread} min={2} max={100} step={1} />
      <SliderWithLabel onChange={setValue('count', setCount)} label="Count" value={count} min={1} max={10} step={1} />
    </>
  )
};

export default Fat;