import Tone from 'tone';
import { List } from 'immutable';
import uuid from 'uuid/v4';
import instrumentPresets from '../../containers/Synth/presets';
import { Instrument } from './models';

const createSequencer = ({ id = uuid(), trackId, name, displayName }) => new Instrument({
  id,
  trackId,
  name,
  displayName,
  preset: instrumentPresets.AMSynth[0],
  effects: new List(),
  type: 'sequencer',
  sliderComponents: List([]),
  synthComponents: List([]),
})

export default createSequencer;