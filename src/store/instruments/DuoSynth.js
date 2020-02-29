import Tone from 'tone';
import { List } from 'immutable';
import uuid from 'uuid/v4';
import instrumentPresets, { tonePresets } from '../../containers/Synth/presets';
import { effectPresetsList, createLfo, effectPresets } from '../../components/EffectChain/presets';
import { AudioInstrument, Instrument } from './models';

export const createDuoSynthAudio = ({ id = uuid(), trackId, name = 'DuoSynth', displayName = 'Duo Synth' }) => new AudioInstrument({
  id,
  name,
  trackId,
  displayName,
  instrument: new Tone.PolySynth(4, Tone.DuoSynth, tonePresets.DuoSynth[0]),
  effects: List([effectPresets.compressor().audioState]),
  lfo: createLfo().audioState,
  lfoGain: new Tone.Gain({ gain: 0 }),
  lfo1: createLfo(1).audioState,
  lfo1Gain: new Tone.Gain({ gain: 0 }),
  filter: effectPresets.filter().audioState,
  instrumentOut: new Tone.Gain(),
  channelOut: new Tone.Channel(),
  voices: 4,
});

export const createDuoSynthUI = ({ id = uuid(), trackId, name = 'DuoSynth', displayName = 'Duo Synth' }) => new Instrument({
  id,
  name,
  trackId,
  displayName,
  preset: instrumentPresets.DuoSynth[0],
  effects: List([effectPresets.compressor().uiState]),
  lfo: createLfo().uiState,
  lfo1: createLfo(1).uiState,
  filter: effectPresets.filter().uiState,
  voices: 4,
  sliderComponents: List([
    {
      label: 'Vibrato Amount',
      name: 'vibratoAmount',
      size: 3,
      min: 0,
      max: 10,
      step: 0.1,
    },
    {
      label: 'Vibrato Rate',
      name: 'vibratoRate',
      size: 3,
      min: 0.1,
      max: 10,
      step: 0.1,
    },
    {
      label: 'Harmonicity',
      name: 'harmonicity',
      size: 3,
      min: 0,
      max: 4,
      step: 0.01,
    },
    {
      label: 'Frequency',
      name: 'frequency',
      size: 3,
      min: 1,
      max: 10000,
      step: 1,
    },
    {
      label: 'Voice 1 volume',
      name: 'volume',
      parent: 'voice0',
      size: 3,
      min: -20,
      max: 20,
      step: 1,
    },
    {
      label: 'Voice 1 portamento',
      name: 'portamento',
      parent: 'voice0',
      size: 3,
      min: 0,
      max: 0.3,
      step: 0.01,
    },
    {
      label: 'Voice 2 volume',
      name: 'volume',
      parent: 'voice1',
      size: 3,
      min: -20,
      max: 20,
      step: 1,
    },
    {
      label: 'Voice 2 portamento',
      name: 'portamento',
      parent: 'voice1',
      size: 3,
      min: 0,
      max: 0.3,
      step: 0.01,
    },
  ]),
  synthComponents: List([
    {
      label: 'Envelope 1',
      name: 'envelope',
      parent: 'voice0',
      component: 'envelope',
      size: { lg: 4, md: 4, xs: 12 },
    },
    {
      label: 'Filter Envelope 1',
      name: 'filterEnvelope',
      parent: 'voice0',
      component: 'envelope',
      type: 'frequency',
      size: { lg: 4, md: 4, xs: 12 },
    },
    {
      label: 'Oscillator 1',
      name: 'oscillator',
      parent: 'voice0',
      component: 'oscillator',
      size: { lg: 4, md: 4, xs: 12 },
    },
    {
      label: 'Envelope 2',
      name: 'envelope',
      parent: 'voice1',
      component: 'envelope',
      size: { lg: 4, md: 4, xs: 12 },
    },
    {
      label: 'Filter Envelope 2',
      name: 'filterEnvelope',
      parent: 'voice1',
      component: 'envelope',
      type: 'frequency',
      size: { lg: 4, md: 4, xs: 12 },
    },
    {
      label: 'Oscillator 2',
      name: 'oscillator',
      parent: 'voice1',
      component: 'oscillator',
      size: { lg: 4, md: 4, xs: 12 },
    },
  ]),
})

export const duoSynth = createDuoSynthUI({ trackId: 2, id: 'DuoSynth' });

export default createDuoSynthUI;