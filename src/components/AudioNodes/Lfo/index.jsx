import React from 'react';
import { withStyles } from '@material-ui/core';
import { SliderWithLabel } from '../../Slider';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import BaseCard, { FullWidthSelect } from '../BaseCard';
import { withInstrumentContext, withPartialInstrumentContext } from '../../../context/InstrumentContext';
// import Visualization from './Vizualization';
import { setToneSignalValue, setToneValue } from '../../../utils';

const styles = theme => ({
  paper: {

  },
});

const STEP = 0.05;

export const setEnvelopeValue = (envelopeNode, value, valueName) => {
  envelopeNode[valueName] = value;
}

const Lfo = ({ label = 'Lfo', classes, preset, setValue }) => (
  <BaseCard label={label}>
    <SliderWithLabel
      onChange={setValue('frequency', setToneSignalValue)}
      label="Frequency"
      value={preset.get('frequency')}
      min={1}
      max={40}
      step={0.5}
    />
    <SliderWithLabel
      onChange={setValue('amplitude', setToneSignalValue)}
      label="Amplitude"
      value={preset.get('amplitude')}
      min={-100}
      max={100}
      step={1}
    />
    <FullWidthSelect items={waveFormsDropdownItems} label="Type" value={preset.get('type')} onChange={setValue('type', setToneValue)} />
    <SliderWithLabel
      onChange={setValue('min', setToneValue)}
      label="Min"
      value={preset.get('min')}
      min={-20}
      max={10000}
      step={1}
    />
    <SliderWithLabel
      onChange={setValue('max', setToneValue)}
      label="Max"
      value={preset.get('max')}
      min={-20}
      max={10000}
      step={1}
    />
    <SliderWithLabel
      onChange={setValue('phase', setToneValue)}
      label="Phase"
      value={preset.get('phase')}
      min={-20}
      max={20}
      step={1}
    />
  </BaseCard>
);

export default withStyles(styles)(withPartialInstrumentContext(React.memo(Lfo), 'lfo'))