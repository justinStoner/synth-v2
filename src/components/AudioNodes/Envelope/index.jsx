import React from 'react';
import { withStyles } from '@material-ui/core';
import { SliderWithLabel } from '../../Slider';
import BaseCard, { SmallSelect } from '../BaseCard';
import { withInstrumentContext, withPartialInstrumentContext } from '../../../context/InstrumentContext';
import Visualization from './Vizualization';
import { envelopeCurvesDisplayNames, decayCurvesDisplayNames } from './utils';

const styles = theme => ({
  paper: {

  },
});

const STEP = 0.05;

export const setEnvelopeValue = (envelopeNode, value, valueName) => {
  envelopeNode[valueName] = value;
}

const Envelope = ({ label = 'Envelope', classes, envelope, setValue }) => {
  const { attack, attackCurve, decay, decayCurve, sustain, release, releaseCurve } = envelope.preset;
  return (
    <BaseCard label={label}>
      <Visualization envelope={envelope.node} preset={envelope.preset} />
      <SliderWithLabel
        onChange={setValue('attack', setEnvelopeValue)}
        label="Attack"
        value={attack}
        min={0.01}
        max={2}
        step={STEP}
        smallDropdown={
          <SmallSelect items={envelopeCurvesDisplayNames} label="Curve:" value={attackCurve} onChange={setValue('attackCurve', setEnvelopeValue)} />
        }
      />
      <SliderWithLabel
        onChange={setValue('decay', setEnvelopeValue)}
        label="Decay"
        value={decay}
        min={0.01}
        max={2}
        step={STEP}
        smallDropdown={
          <SmallSelect items={decayCurvesDisplayNames} label="Curve:" value={decayCurve} onChange={setValue('decayCurve', setEnvelopeValue)} />
        }
      />
      <SliderWithLabel
        onChange={setValue('sustain', setEnvelopeValue)}
        label="Sustain"
        value={sustain}
        min={0.01}
        max={1}
        step={STEP}
      />
      <SliderWithLabel
        onChange={setValue('release', setEnvelopeValue)}
        label="Release"
        value={release}
        min={0.01}
        max={4}
        step={STEP}
        smallDropdown={
          <SmallSelect items={envelopeCurvesDisplayNames} label="Curve:" value={releaseCurve} onChange={setValue('releaseCurve', setEnvelopeValue)} />
        }
      />
    </BaseCard>
  )
};

export default withStyles(styles)(withPartialInstrumentContext(React.memo(Envelope), 'envelope'))