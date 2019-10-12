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

const Envelope = ({ preset, setValue }) => (
  <>
    <SliderWithLabel
      onChange={setValue('attack', setEnvelopeValue)}
      label="Attack"
      value={preset.get('attack')}
      min={0.01}
      max={2}
      step={STEP}
      smallDropdown={
        <SmallSelect items={envelopeCurvesDisplayNames} label="Curve:" value={preset.get('attackCurve')} onChange={setValue('attackCurve', setEnvelopeValue)} />
      }
    />
    <SliderWithLabel
      onChange={setValue('decay', setEnvelopeValue)}
      label="Decay"
      value={preset.get('decay')}
      min={0.01}
      max={2}
      step={STEP}
      smallDropdown={
        <SmallSelect items={decayCurvesDisplayNames} label="Curve:" value={preset.get('decayCurve')} onChange={setValue('decayCurve', setEnvelopeValue)} />
      }
    />
    <SliderWithLabel
      onChange={setValue('sustain', setEnvelopeValue)}
      label="Sustain"
      value={preset.get('sustain')}
      min={0.01}
      max={1}
      step={STEP}
    />
    <SliderWithLabel
      onChange={setValue('release', setEnvelopeValue)}
      label="Release"
      value={preset.get('release')}
      min={0.01}
      max={4}
      step={STEP}
      smallDropdown={
        <SmallSelect items={envelopeCurvesDisplayNames} label="Curve:" value={preset.get('releaseCurve')} onChange={setValue('releaseCurve', setEnvelopeValue)} />
      }
    />
  </>
);

export default React.memo(Envelope);