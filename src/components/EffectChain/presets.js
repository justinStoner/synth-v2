import Tone from 'tone';
import { OrderedMap, Map, List } from 'immutable';
import uuid from 'uuid/v4';

export const reverbPresets = [
  Map({
    roomSize: 0.25,
    dampening: 10000,
    wet: 0.5,
  }),
];

export const lfoPresets = [
  Map({
    type: 'sine',
    min: 450,
    max: 3000,
    phase: 0,
    frequency: 1.5,
    amplitude: 75,
    modulation: 'cutoff',
  }),
  Map({
    type: 'sine',
    min: 1,
    max: 5,
    phase: 0,
    frequency: 1.5,
    amplitude: 85,
    modulation: 'q',
  }),
];

export const createLfo = (index = 0) => Map({
  tone: new Tone.LFO(lfoPresets[index].toJS()),
  preset: lfoPresets[index],
  displayName: 'Lfo',
  id: uuid(),
  type: 'lfo',
});

export const chorusPresets = [
  Map({
    frequency: 0.2,
    delayTime: 1,
    depth: 0.5,
    type: 'square',
    spread: 180,
    wet: 0.5,
  }),
];

export const phaserPresets = [
  Map({
    frequency: 2.3,
    octaves: 1.5,
    stages: 6,
    Q: 5 ,
    baseFrequency: 3000,
    wet: 0.7,
  }),
]

export const delayPresets = [
  Map({
    delayTime: 0.25,
    feedback: 0.15,
    wet: 0.1,
  }),
];

export const compressorPresets = [
  Map({
    ratio: 10 ,
    threshold: -55,
    release: 0.25 ,
    attack: 0.003 ,
    knee: 35,
  }),
]

export const filterPresets = [
  Map({
    type: 'lowpass' ,
    frequency: 450,
    rolloff: -12 ,
    Q: 1,
    gain: -32,
  }),
  Map({
    type: 'peaking' ,
    frequency: 6700 ,
    rolloff: -12 ,
    Q: 1 ,
    gain: 6,
  }),
  Map({
    type: 'peaking' ,
    frequency: 9800 ,
    rolloff: -24 ,
    Q: 0.01,
    gain: 13,
  }),
]

export const presets = OrderedMap({
  reverb: reverbPresets[0],
  chorus: chorusPresets[0],
  phaser: phaserPresets[0],
  delay: delayPresets[0],
  compressor: compressorPresets[0],
  filter: filterPresets[0],
});

export const effectMenuItems = [
  { value: 'reverb', label: 'Reverb' },
  { value: 'chorus', label: 'Chorus' },
  { value: 'phaser', label: 'Phaser' },
  { value: 'delay', label: 'Delay' },
  { value: 'compressor', label: 'Compressor' },
  { value: 'filter', label: 'Filter' },
]

export const effectPresets = OrderedMap({
  reverb: (index = 0) => Map({
    tone: new Tone.Freeverb(reverbPresets[index].toJS()),
    preset: reverbPresets[index],
    displayName: 'Reverb',
    id: uuid(),
    type: 'reverb',
  }),
  chorus: (index = 0) => Map({
    tone: new Tone.Chorus(chorusPresets[index].toJS()),
    preset: chorusPresets[index],
    displayName: 'Chorus',
    id: uuid(),
    type: 'chorus',
  }),
  phaser: (index = 0) => Map({
    tone: new Tone.Phaser(phaserPresets[index].toJS()),
    preset: phaserPresets[index],
    displayName: 'Phaser',
    id: uuid(),
    type: 'phaser',
  }),
  delay: (index = 0) => Map({
    tone: new Tone.FeedbackDelay(delayPresets[index].toJS()),
    preset: delayPresets[index],
    displayName: 'Delay',
    id: uuid(),
    type: 'delay',
  }),
  filter: (index = 0) => Map({
    tone: new Tone.Filter(filterPresets[index].toJS()),
    preset: filterPresets[index],
    displayName: 'Filter',
    id: uuid(),
    type: 'filter',
    noWet: true,
  }),
  compressor: () => Map({
    tone: new Tone.Compressor(compressorPresets[0].toJS()),
    preset: compressorPresets[0],
    displayName: 'Compressor',
    id: uuid(),
    type: 'compressor',
    noWet: true,
  }),
});

export const effectPresetsList = List([
  effectPresets.get('reverb'),
  //effectPresets.get('chorus'),
  //effectPresets.get('phaser'),
  effectPresets.get('delay'),
  effectPresets.get('compressor'),
])