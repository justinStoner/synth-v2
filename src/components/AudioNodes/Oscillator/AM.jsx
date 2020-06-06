import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType, setHarmonicity  } from './utils';
import { Osc } from './Osc';

export const AM = ({ preset, setValue }) => (
    <>
      <Osc preset={preset} setValue={setValue} />
      <FullWidthSelect items={waveFormsDropdownItems} label="Modulation Type" value={preset.get('modulationType')} onChange={setValue('modulationType')} />
      <SliderWithLabel onChange={setValue('harmonicity')} label="Harmonicity" value={preset.get('harmonicity')} min={0} max={5} step={0.05} />
    </>
);

export default AM;