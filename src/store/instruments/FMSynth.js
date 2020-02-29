import Tone from 'tone';
import { List } from 'immutable';
import uuid from 'uuid/v4';
import { AudioInstrument, Instrument } from './models';
import instrumentPresets, { tonePresets } from '../../containers/Synth/presets';
import { effectPresetsList, createLfo, effectPresets } from '../../components/EffectChain/presets';

const effectPreset = List(effectPresetsList.valueSeq().map(effect => effect()));

export const createFMSynthAudio = ({ id = uuid(), trackId, name = 'FMSynth', displayName = 'FM Synth' }) => new AudioInstrument({
  instrumentOut: new Tone.Gain(),
  channelOut: new Tone.Channel(),
  lfo: createLfo().audioState,
  lfo1: createLfo(1).audioState,
  lfoGain: new Tone.Gain({ gain: 0 }),
  lfo1Gain: new Tone.Gain({ gain: 0 }),
  filter: effectPresets.filter().audioState,
  instrument: new Tone.PolySynth(4, Tone.FMSynth, tonePresets.FMSynth[0]),
  effects: effectPreset.map(e => e.uiState),
  id,
  trackId,
  name,
  displayName,
});

const createFMSynthUI = ({ id = uuid(), trackId, name = 'FMSynth', displayName = 'FM Synth' }) => new Instrument({
  id,
  trackId,
  name,
  displayName,
  preset: instrumentPresets.FMSynth[0],
  effects: effectPreset.map(e => e.uiState),
  lfo: createLfo().uiState,
  lfo1: createLfo(1).uiState,
  filter: effectPresets.filter().uiState,
  sliderComponents: List([
    {
      label: 'Portamento',
      name: 'portamento',
      min: 0,
      max: 0.3,
      step: 0.01,
    },
    {
      label: 'Harmonicity',
      name: 'harmonicity',
      min: 0,
      max: 4,
      step: 0.01,
    },
    {
      label: 'Modulation Index',
      name: 'modulationIndex',
      min: 0,
      max: 40,
      step: 1,
    },
  ]),
  synthComponents: List([
    {
      label: 'Carrier Envelope',
      name: 'envelope',
      component: 'envelope',
    },
    {
      label: 'Carrier Oscillator',
      name: 'oscillator',
      component: 'oscillator',
    },
    {
      label: 'Modulation Envelope',
      name: 'modulationEnvelope',
      component: 'envelope',
    },
    {
      label: 'Modulation Oscillator',
      name: 'modulation',
      component: 'oscillator',
    },
  ]),
})

export default createFMSynthUI

export const fmSynth = createFMSynthUI({ trackId: 1, id: 'FMSynth' });