import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { setPartialCount, setBaseType, setWidth  } from './utils';

export const Pulse = ({ preset, setValue, hidePartials = false }) => (
    <>
     <SliderWithLabel onChange={setValue('width', setWidth)} label="Width" value={preset.get('width')} min={0.00} max={1} step={0.05} />
    </>
);

export default Pulse;