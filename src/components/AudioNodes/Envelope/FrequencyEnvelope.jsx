import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import Envelope, { setEnvelopeValue } from './Envelope';

export const FrequencyEnvelope = ({ preset, setValue }) => (
    <>
     <Envelope preset={preset} setValue={setValue} />
     <SliderWithLabel onChange={setValue('baseFrequency', setEnvelopeValue)} label="Base frequency" value={preset.get('baseFrequency')} min={0.01} max={2000} step={10} />
     <SliderWithLabel onChange={setValue('octaves', setEnvelopeValue)} label="Octaves" value={preset.get('octaves')} min={0} max={4} step={1} />
     <SliderWithLabel onChange={setValue('exponent', setEnvelopeValue)} label="Exponent" value={preset.get('exponent')} min={0} max={10} step={1} />
    </>
);

export default FrequencyEnvelope;