import React from 'react';
import { withStyles } from '@material-ui/core';
import { SliderWithLabel } from '../../Slider';
import waveForms, { waveFormsDropdownItems } from '../../../utils/waveforms';
import BaseCard, { FullWidthSelect, HeaderSelect } from '../BaseCard';
import { withPartialInstrumentContext } from '../../../context/InstrumentContext';
import { buildToneOscillatorType, oscillatorSourceTypesDisplayNames, oscillatorSourceTypes, setSourceType } from './utils';
import { oscillatorPresets } from '../../../containers/Synth/presets';
import FM from './FM';
import AM from './AM';
import Fat from './Fat';
import Osc from './Osc';
import Pulse from './Pulse';
import PWM from './PWM';
import Visualization from './Visualization';

const styles = theme => ({
  textField: {
  },
});

const getComponent = (sourceType, oscillator, setValue) => {
  switch (sourceType) {
  case oscillatorSourceTypes.fm:
    return <FM oscillator={oscillator} setValue={setValue} />;
  case oscillatorSourceTypes.am:
    return <AM oscillator={oscillator} setValue={setValue} />;
  case oscillatorSourceTypes.fat:
    return <Fat oscillator={oscillator} setValue={setValue} />;
  case oscillatorSourceTypes.osc:
    return <Osc oscillator={oscillator} setValue={setValue} />;
  case oscillatorSourceTypes.pulse:
    return <Pulse oscillator={oscillator} setValue={setValue} />;
  case oscillatorSourceTypes.pwm:
    return <PWM oscillator={oscillator} setValue={setValue} />;
  default:
    return null;
  }
}

const Oscillator = ({ label = 'Oscillator', classes, oscillator, setValue, setPreset }) => {
  const { sourceType } = oscillator.preset;
  return (
    <BaseCard
      label={label}
      headerComponent={<HeaderSelect items={oscillatorSourceTypesDisplayNames} value={sourceType} onChange={e => {setPreset(oscillatorPresets[e.target.value][0]); setSourceType(oscillator.node, e.target.value, null, oscillatorPresets[e.target.value][0])}} />}
    >
      <Visualization oscillator={oscillator.node} preset={oscillator.preset} />
      {getComponent(sourceType, oscillator, setValue)}
    </BaseCard>
  )
};

export default withStyles(styles)(withPartialInstrumentContext(React.memo(Oscillator), 'oscillator'))