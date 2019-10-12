import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType, setHarmonicity, setSpread, setCount  } from './utils';
import { Osc } from './Osc';

export const Fat = ({ preset, setValue }) => (
    <>
      <Osc preset={preset} setValue={setValue} />
      <SliderWithLabel onChange={setValue('spread', setSpread)} label="Spread" value={preset.get('spread')} min={2} max={100} step={1} />
      <SliderWithLabel onChange={setValue('count', setCount)} label="Count" value={preset.get('count')} min={1} max={10} step={1} />
    </>
);

export default Fat;