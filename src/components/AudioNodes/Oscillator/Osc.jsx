import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType  } from './utils';

export const Osc = ({ preset, setValue, hidePartials = false }) => (
    <>
      <FullWidthSelect items={waveFormsDropdownItems} label="Type" value={preset.get('baseType')} onChange={setValue('baseType', setBaseType)} />
     {!hidePartials && <SliderWithLabel onChange={setValue('partialCount')} label="Partial Count" value={preset.get('partialCount')} min={0} max={32} step={1} />}
    </>
);

export default Osc;