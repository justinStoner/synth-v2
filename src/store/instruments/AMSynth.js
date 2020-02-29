import Tone from 'tone';
import { List } from 'immutable';
import uuid from 'uuid/v4';
import instrumentPresets, { tonePresets } from '../../containers/Synth/presets';
import { effectPresetsList, createLfo, effectPresets } from '../../components/EffectChain/presets';
import { AudioInstrument, Instrument } from './models';

const effectPreset = List(effectPresetsList.valueSeq().map(effect => effect()));

export const createAMSynthAudio = ({ id = uuid(), trackId, name, displayName }) => new AudioInstrument({
  instrument: new Tone.PolySynth(4, Tone.AMSynth, tonePresets.AMSynth[0]),
  instrumentOut: new Tone.Gain(),
  channelOut: new Tone.Channel(),
  lfoGain: new Tone.Gain({ gain: 0 }),
  lfo1Gain: new Tone.Gain({ gain: 0 }),
  effects: effectPreset.map(e => e.audioState),
  filter: effectPresets.filter().audioState,
  lfo: createLfo().audioState,
  lfo1: createLfo(1).audioState,
  id,
  trackId,
  name,
  displayName,
});

const createAMSynthUI = ({ id = uuid(), trackId, name, displayName }) => new Instrument({
  id,
  trackId,
  name,
  displayName,
  preset: instrumentPresets.AMSynth[0],
  effects: effectPreset.map(e => e.uiState),
  lfo: createLfo().uiState,
  lfo1: createLfo(1).uiState,
  filter: effectPresets.filter().uiState,
  voices: 4,
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

export default createAMSynthUI;

export const amSynth = createAMSynthUI({ trackId: 0, id: 'AMSynth' });
