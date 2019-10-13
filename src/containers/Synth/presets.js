import Tone from 'tone';
import { List, Map } from 'immutable';
import { convertOscillatorToToneOscillator, oscillatorSourceTypes } from '../../components/AudioNodes/Oscillator/utils'
import { decayCurves, envelopeCurves } from '../../components/AudioNodes/Envelope/utils'
import { createLfo, effectPresets } from '../../components/EffectChain/presets';

export const oscillatorPresets = {
  [oscillatorSourceTypes.fat]: [
    Map({
      sourceType: 'fat',
      baseType: 'sawtooth',
      count: 2,
      spread: 25,
      partialCount: 0,
    }),
    Map({
      sourceType: 'fat',
      baseType: 'sine',
      count: 3,
      spread: 25,
      partialCount: 32,
    }),
  ],
  [oscillatorSourceTypes.osc]: [
    Map({
      sourceType: 'osc',
      baseType: 'sine',
      partialCount: 0,
    }),
    Map({
      sourceType: 'osc',
      baseType: 'sine',
      partialCount: 21,
    }),
  ],
  [oscillatorSourceTypes.am]: [Map({
    sourceType: 'am',
    baseType: 'sine',
    modulationType: 'sine',
    partialCount: 1,
    harmonicity: 1,
  })],
  [oscillatorSourceTypes.fm]: [Map({
    sourceType: 'fm',
    baseType: 'triangle',
    modulationIndex: 10,
    modulationType: 'sine',
    harmonicity: 0.45,
    partialCount: 16,
  })],
  [oscillatorSourceTypes.pulse]: [Map({
    sourceType: 'pulse',
    width: 0.2,
  })],
  [oscillatorSourceTypes.pwm]: [Map({
    sourceType: 'pwm',
    modulationFrequency: 0.4,
  })],
}

export const envelopePresets = [
  Map({
    attack: 0.25,
    attackCurve: envelopeCurves.cosine,
    decay: 0,
    decayCurve: decayCurves.linear,
    sustain: 1,
    release: 0.4,
    releaseCurve: envelopeCurves.cosine,
  }),
  Map({
    attack: 0.25,
    attackCurve: envelopeCurves.bounce,
    decay: 0,
    decayCurve: decayCurves.linear,
    sustain: 1,
    release: 0.4,
    releaseCurve: envelopeCurves.bounce,
  }),
  Map({
    attack: 0.25,
    attackCurve: envelopeCurves.bounce,
    decay: 0,
    decayCurve: decayCurves.linear,
    sustain: 1,
    release: 1,
    releaseCurve: envelopeCurves.bounce,
  }),
];

export const freqEnvelopePresets = [
  Map({
    attack: 0.25,
    attackCurve: envelopeCurves.cosine,
    decay: 0,
    decayCurve: decayCurves.linear,
    sustain: 1,
    release: 1,
    releaseCurve: envelopeCurves.cosine,
    baseFrequency: 200,
    octaves: 2,
    exponent: 2,
  }),
  Map({
    attack: 0.25,
    attackCurve: envelopeCurves.bounce,
    decay: 0,
    decayCurve: decayCurves.linear,
    sustain: 1,
    release: 1,
    releaseCurve: envelopeCurves.bounce,
    baseFrequency: 200,
    octaves: 2,
    exponent: 1,
  }),
]

const presets = {
  AMSynth: [
    Map({
      harmonicity: 2.5,
      detune: 0,
      portamento: 0.1,
      oscillator: oscillatorPresets.fat[0],
      envelope: envelopePresets[0],
      modulation: oscillatorPresets.am[0],
      modulationEnvelope: envelopePresets[1],
    }),
  ],
  FMSynth: [
    Map({
      harmonicity: 2.5,
      detune: 0,
      portamento: 0.1,
      modulationIndex: 10,
      oscillator: oscillatorPresets.fat[1],
      envelope: envelopePresets[0],
      modulation: oscillatorPresets.osc[1],
      modulationEnvelope: envelopePresets[1],
    }),
  ],
  PluckSynth: [
    Map({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.7,
    }),
  ],
  DuoSynth: [
    Map({
      vibratoAmount: 0.5,
      vibratoRate: 5,
      harmonicity: 1.5,
      frequency: 2500,
      voice0: Map({
        volume: -10,
        portamento: 0.1,
        oscillator: oscillatorPresets.fat[0],
        filterEnvelope: freqEnvelopePresets[0],
        envelope: envelopePresets[2],
      }),
      voice1: Map({
        volume: -10,
        portamento: 0.1,
        oscillator: oscillatorPresets.osc[1],
        filterEnvelope: freqEnvelopePresets[1],
        envelope: envelopePresets[2],
      }),
    }),
  ],
}

export default presets;

export const instrumentNames = [
  {
    label: 'AM Synth',
    value: 'AMSynth',
  },
  {
    label: 'FM Synth',
    value: 'FMSynth',
  },
  {
    label: 'Pluck Synth',
    value: 'PluckSynth',
  },
  {
    label: 'Duo Synth',
    value: 'DuoSynth',
  },
]

const convertToTonePreset = preset => preset.map(p => {
  const pJS = p.toJS();
  return Object.assign({}, pJS, {
    oscillator: convertOscillatorToToneOscillator(pJS.oscillator),
    modulation: convertOscillatorToToneOscillator(pJS.modulation),
  })
})

export const tonePresets = {
  AMSynth: convertToTonePreset(presets.AMSynth),
  FMSynth: convertToTonePreset(presets.FMSynth),
  PluckSynth: presets.PluckSynth.map(p => p.toJS()),
  DuoSynth: presets.DuoSynth.map(preset => {
    const p = preset.toJS();
    return Object.assign({}, p, {
      voice0: Object.assign({}, p.voice0, { oscillator: convertOscillatorToToneOscillator(p.voice0.oscillator) }),
      voice1: Object.assign({}, p.voice1, { oscillator: convertOscillatorToToneOscillator(p.voice1.oscillator) }),
    });
  }),
}