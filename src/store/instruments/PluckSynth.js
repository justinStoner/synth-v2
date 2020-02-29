import Tone from 'tone';
import { List } from 'immutable';
import uuid from 'uuid/v4';
import { AudioInstrument, Instrument } from './models';
import instrumentPresets, { tonePresets } from '../../containers/Synth/presets';
import { effectPresetsList, createLfo, effectPresets } from '../../components/EffectChain/presets';

const effectPreset = List(effectPresetsList.valueSeq().map(effect => effect()));

export const createPluckSynthAudio = ({ id = uuid(), trackId, name = 'PluckSynth', displayName = 'Pluck Synth' }) => new AudioInstrument({
  id,
  trackId,
  name,
  displayName,
  instrument: new Tone.PluckSynth(tonePresets.PluckSynth[0]),
  preset: instrumentPresets.PluckSynth[0],
  effects: effectPreset.audioState,
  lfo: createLfo().audioState,
  lfo1: createLfo(1).audioState,
  lfoGain: new Tone.Gain({ gain: 0 }),
  lfo1Gain: new Tone.Gain({ gain: 0 }),
  filter: effectPresets.filter().audioState,
  instrumentOut: new Tone.Gain(),
  channelOut: new Tone.Channel(),
});

const createPluckSynthUI = ({ id = uuid(), trackId, name = 'PluckSynth', displayName = 'Pluck Synth' }) => new Instrument({
  id,
  trackId,
  name,
  displayName,
  preset: instrumentPresets.PluckSynth[0],
  effects: effectPreset.uiState,
  lfo: createLfo().uiState,
  lfo1: createLfo(1).uiState,
  filter: effectPresets.filter().uiState,
  voices: 4,
  monophonic: true,
  sliderComponents: List([
    {
      label: 'Attack noise',
      name: 'attackNoise',
      min: 0.1,
      max: 20,
      step: 0.1,
    },
    {
      label: 'Dampening',
      name: 'dampening',
      min: 20,
      max: 20000,
      step: 10,
    },
    {
      label: 'Resonance',
      name: 'resonance',
      min: 0.01,
      max: 1,
      step: 0.01,
    },
  ]),
})

export default createPluckSynthUI

export const pluckSynth = createPluckSynthUI({ trackId: 3, id: 'PluckSynth' });