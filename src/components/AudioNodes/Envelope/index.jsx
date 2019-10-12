import React from 'react';
import { withStyles } from '@material-ui/core';
import { SliderWithLabel } from '../../Slider';
import BaseCard, { SmallSelect } from '../BaseCard';
import { withInstrumentContext, withPartialInstrumentContext } from '../../../context/InstrumentContext';
import Visualization from './Vizualization';
import FrequencyEnvelope from './FrequencyEnvelope';
import Envelope from './Envelope';
import { envelopeCurvesDisplayNames, decayCurvesDisplayNames } from './utils';

const styles = theme => ({
  paper: {

  },
});

const getComponent = (type, props) => {
  switch (type) {
  case 'envelope':
    return <Envelope {...props} />
  case 'frequency':
    return <FrequencyEnvelope {...props} />
  default:
    return null;
  }
}

export const setEnvelopeValue = (envelopeNode, value, valueName) => {
  envelopeNode[valueName] = value;
}

const Env = ({ label = 'Envelope', classes, preset, audioNode, setValue, size, type = 'envelope' }) => (
  <BaseCard label={label} size={size}>
    <Visualization audioNode={audioNode} preset={preset} />
    {getComponent(type, { preset, setValue })}
  </BaseCard>
);

export default withStyles(styles)(withPartialInstrumentContext(React.memo(Env)))