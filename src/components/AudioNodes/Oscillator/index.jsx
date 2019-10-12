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

const getComponent = (sourceType, props) => {
  switch (sourceType) {
  case oscillatorSourceTypes.fm:
    return <FM {...props} />;
  case oscillatorSourceTypes.am:
    return <AM {...props} />;
  case oscillatorSourceTypes.fat:
    return <Fat {...props} />;
  case oscillatorSourceTypes.osc:
    return <Osc {...props} />;
  case oscillatorSourceTypes.pulse:
    return <Pulse {...props} />;
  case oscillatorSourceTypes.pwm:
    return <PWM {...props} />;
  default:
    return null;
  }
}

const Oscillator = ({ label = 'Oscillator', classes, preset, audioNode, setValue, setPreset, size }) => {
  const sourceType = preset.get('sourceType');
  return (
    <BaseCard
      label={label}
      size={size}
      headerComponent={<HeaderSelect items={oscillatorSourceTypesDisplayNames} value={sourceType} onChange={e => {setPreset(oscillatorPresets[e.target.value][0]); setSourceType(audioNode, e.target.value, null, oscillatorPresets[e.target.value][0].toJS())}} />}
    >
      <Visualization audioNode={audioNode} preset={preset} />
      {getComponent(sourceType, { preset, setValue })}
    </BaseCard>
  )
};

export default withStyles(styles)(withPartialInstrumentContext(React.memo(Oscillator), 'oscillator'))