import Tone from 'tone';
import { List } from 'immutable';
import { convertOscillatorToToneOscillator, oscillatorSourceTypes } from '../../components/AudioNodes/Oscillator/utils'
import { decayCurves, envelopeCurves } from '../../components/AudioNodes/Envelope/utils'
import { createLfo, effectPresets } from '../../components/EffectChain/presets';

export const oscillatorPresets = {
  [oscillatorSourceTypes.fat]: [{
    sourceType: 'fat',
    baseType: 'sawtooth',
    count: 3,
    spread: 25,
    partialCount: 0,
  },
  {
    sourceType: 'fat',
    baseType: 'sine',
    count: 3,
    spread: 25,
    partialCount: 32,
  },
  ],
  [oscillatorSourceTypes.osc]: [{
    sourceType: 'osc',
    baseType: 'sine',
    partialCount: 0,
  }],
  [oscillatorSourceTypes.am]: [{
    sourceType: 'am',
    baseType: 'sine' ,
    modulationType: 'sine',
    partialCount: 32,
    harmonicity: 1,
  }],
  [oscillatorSourceTypes.fm]: [{
    sourceType: 'fm',
    baseType: 'triangle' ,
    modulationIndex: 10,
    modulationType: 'sine' ,
    harmonicity: 0.45,
    partialCount: 16,
  }],
  [oscillatorSourceTypes.pulse]: [{
    sourceType: 'pulse',
    width: 0.2,
  }],
  [oscillatorSourceTypes.pwm]: [{
    sourceType: 'pwm',
    modulationFrequency: 0.4,
  }],
}

export const envelopePresets = [
  {
    attack: 0.25,
    attackCurve: envelopeCurves.cosine,
    decay: 0,
    decayCurve: decayCurves.linear,
    sustain: 1,
    release: 0.4,
    releaseCurve: envelopeCurves.cosine,

  },
  {
    attack: 0.25,
    attackCurve: envelopeCurves.bounce,
    decay: 0,
    decayCurve: decayCurves.linear,
    sustain: 1,
    release: 0.4,
    releaseCurve: envelopeCurves.bounce,
  },
]

const presets = {
  AMSynth: [{
    harmonicity: 2.5,
    detune: 0,
    portamento: 0.1,
    oscillator: oscillatorPresets.fat[1],
    envelope: envelopePresets[0],
    modulation: oscillatorPresets.fm[0],
    modulationEnvelope: envelopePresets[1],
  }],
  FMSynth: [{
    harmonicity: 2.5,
    detune: 0,
    portamento: 0.1,
    modulationIndex: 10,
    oscillator: oscillatorPresets.fat[1],
    envelope: envelopePresets[0],
    modulation: oscillatorPresets.fm[0],
    modulationEnvelope: envelopePresets[1],
  }],
}

export default presets;

export const tonePresets = {
  AMSynth: presets.AMSynth.map(preset => Object.assign({}, preset, {
    oscillator: convertOscillatorToToneOscillator(preset.oscillator),
    modulation: convertOscillatorToToneOscillator(preset.modulation),
  })),
  FMSynth: presets.AMSynth.map(preset => Object.assign({}, preset, {
    oscillator: convertOscillatorToToneOscillator(preset.oscillator),
    modulation: convertOscillatorToToneOscillator(preset.modulation),
  })),
}

export const instrumentPresets = {
  AMSynth: () => ({
    preset: JSON.parse(JSON.stringify(presets.AMSynth[0])),
    displayName: 'AM Synth',
    polyphonic: true,
  }),
  FMSynth: () => ({
    preset: JSON.parse(JSON.stringify(presets.FMSynth[0])),
    displayName: 'FM Synth',
    polyphonic: true,
  }),
}