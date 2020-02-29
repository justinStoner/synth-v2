import { List, Record } from 'immutable';

export const AudioInstrument = new Record({
  instrument: null,
  id: null,
  trackId: null,
  effects: [],
  lfo: null,
  lfo1: null,
  lfoGain: null,
  lfo1Gain: null,
  filter: null,
  instrumentOut: null,
  channelOut: null,
  initialized: false,
  voices: 4,
  type: 'synth',
})

export const Instrument = new Record({
  name: 'AMSynth',
  displayName: 'AM Synth',
  id: 'AMSynth',
  audioNode: null,
  preset: null,
  trackId: null,
  effects: List(),
  lfo: null,
  lfo1: null,
  lfoGain: null,
  lfo1Gain: null,
  filter: null,
  instrumentOut: null,
  channelOut: null,
  voices: 4,
  sliderComponents: List(),
  synthComponents: List(),
  type: 'synth',
}, 'Instrument');