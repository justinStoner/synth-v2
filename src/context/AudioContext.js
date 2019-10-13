import React from 'react';
import Tone from 'tone';
import { OrderedMap, Map, List, Record } from 'immutable';
import withContextFactory from './withContextFactory';
import instrumentPresets, { tonePresets, instrumentNames } from '../containers/Synth/presets';
import { effectPresetsList, createLfo, effectPresets } from '../components/EffectChain/presets';
import TestSynth from '../containers/Synth/customSynths/TestSynth';

const context = new Tone.Context();

const AudioContext = React.createContext({
  context,
  instruments: List(),
  output: null,
  setInstrument: () => {},
  updateInstrument: () => {},
  removeEffect: () => {},
  getTone: () => {},
  getPreset: () => {},
  getInputNode: () => {},
  getOutputNode: () => {},
  moveNode: () => {},
  addEffect: () => {},
  setEffect: () => {},
  setSelectedInstrument: () => {},
  setTrackData: () => {},
  setIsPlaying: () => {},
  selectedInstrument: 'DuoSynth',
  tracks: List(),
});

const Track = new Record({
  volume: 0,
  pan: 0,
  mute: false,
  solo: false,
  name: '',
  displayName: '',
  recording: false,
  audioData: null,
})

export class AudioContextContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      context,
      tracks: List(instrumentNames.map(i => new Track({ name: i.value, displayName: i.label }))),
      selectedInstrument: 'DuoSynth',
      instruments: Map({
        AMSynth: Map({
          name: 'AMSynth',
          displayName: 'AM Synth',
          id: 'AMSynth',
          audioNode: new Tone.PolySynth(4, Tone.AMSynth, tonePresets.AMSynth[0]),
          preset: instrumentPresets.AMSynth[0],
          effects: List(effectPresetsList.valueSeq().map(effect => effect())),
          lfo: createLfo(),
          lfo1: createLfo(1),
          lfoGain: new Tone.Gain({ gain: 0 }),
          lfo1Gain: new Tone.Gain({ gain: 0 }),
          filter: effectPresets.filter(),
          instrumentOut: new Tone.Gain(),
          channelOut: new Tone.Channel(),
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
        }),
        FMSynth: Map({
          name: 'FMSynth',
          displayName: 'FM Synth',
          id: 'FMSynth',
          audioNode: new Tone.PolySynth(4, Tone.FMSynth, tonePresets.FMSynth[0]),
          preset: instrumentPresets.FMSynth[0],
          effects: List(effectPresetsList.valueSeq().map(effect => effect())),
          lfo: createLfo(),
          lfo1: createLfo(1),
          lfoGain: new Tone.Gain({ gain: 0 }),
          lfo1Gain: new Tone.Gain({ gain: 0 }),
          filter: effectPresets.filter(),
          instrumentOut: new Tone.Gain(),
          channelOut: new Tone.Channel(),
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
        }),
        PluckSynth: Map({
          name: 'PluckSynth',
          displayName: 'Pluck Synth',
          id: 'PluckSynth',
          audioNode: new Tone.PluckSynth(tonePresets.PluckSynth[0]),
          preset: instrumentPresets.PluckSynth[0],
          effects: List(effectPresetsList.valueSeq().map(effect => effect())),
          lfo: createLfo(),
          lfo1: createLfo(1),
          lfoGain: new Tone.Gain({ gain: 0 }),
          lfo1Gain: new Tone.Gain({ gain: 0 }),
          filter: effectPresets.filter(),
          instrumentOut: new Tone.Gain(),
          channelOut: new Tone.Channel(),
          voices: 1,
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
        }),
        DuoSynth: Map({
          name: 'DuoSynth',
          displayName: 'Pluck Synth',
          id: 'DuoSynth',
          audioNode: new Tone.PolySynth(4, Tone.DuoSynth, tonePresets.DuoSynth[0]),
          preset: instrumentPresets.DuoSynth[0],
          effects: List([effectPresets.compressor()]),
          lfo: createLfo(),
          lfoGain: new Tone.Gain({ gain: 0 }),
          lfo1: createLfo(1),
          lfo1Gain: new Tone.Gain({ gain: 0 }),
          filter: effectPresets.filter(),
          instrumentOut: new Tone.Gain(),
          channelOut: new Tone.Channel(),
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
        }),
      }),
      isPlaying: false,
      output: Tone.Master,
      setInstrument: this.setInstrument,
      updateInstrument: this.updateInstrument,
      removeEffect: this.removeEffect,
      getTone: this.getTone,
      getPreset: this.getPreset,
      getInputNode: this.getPreset,
      getOutputNode: this.getPreset,
      moveNode: this.moveNode,
      addEffect: this.addEffect,
      setEffect: this.setEffect,
      setSelectedInstrument: this.setSelectedInstrument,
      setTrackData: this.setTrackData,
      setIsPlaying: this.setIsPlaying,
    }
  }

  setEffect = (instrumentName, fieldNames) => (preset, tone, inputNode, outputNode, setTone) => (valueName, setToneEffect) => (event, value) => {
    const val = event && event.target && event.target.value ? event.target.value : value;
    setToneEffect && setToneEffect(tone, val, valueName, preset, inputNode, outputNode, setTone);
    this.setState({ instruments: this.state.instruments.setIn([instrumentName, ...fieldNames, 'preset', valueName], val) });
  }

  setIsPlaying = () => {
    const isPlaying = !this.state.isPlaying;
    this.setState({ isPlaying })
  }

  setTrackData = (index, field, data) => {
    console.log(index, field, data);
    this.setState({ tracks: this.state.tracks.setIn([index, field], data) })
    console.log(this.state.tracks.get(index));
  }

  setInstrument = (instrumentName, instrument) => {
    this.setState({ instruments: this.state.instruments.set(instrumentName, instrument) })
  }

  setSelectedInstrument = selectedInstrument => { this.setState({ selectedInstrument })}

  getInputNode = (instrumentName, index) => index === 0 ? this.getInstrumentOut(instrumentName) : this.state.instruments.getIn([instrumentName, 'effects', index -1, 'tone'])

  getOutputNode = (instrumentName, index) => index + 1 === this.state.instruments.getIn([instrumentName, 'effects']).size ? this.state.output : this.state.instruments.getIn([instrumentName, 'effects', index + 1, 'tone'])

  getTone = (instrumentName, index) => this.state.instruments.getIn([instrumentName, 'effects', index, 'tone'])

  getPreset = (instrumentName, index) => this.state.instruments.getIn([instrumentName, 'effects', index, 'preset'])

  getEffects = instrumentName => this.state.instruments.getIn([instrumentName, 'effects']);

  getInstrumentOut = instrumentName => this.state.instruments.getIn([instrumentName, 'instrumentOut']);

  updateInstrument = (instrumentName, path, newInstrument) => {
    this.setState({ instruments: this.state.instruments.mergeIn([instrumentName, ...path], newInstrument) })
  }

  addEffect = (instrumentName, newEffect) => {
    const effects = this.getEffects(instrumentName);
    const lastEffect = effects.size > 0 ? effects.last().get('tone') : this.getInstrumentOut(instrumentName);
    const outputNode = this.getOutputNode(instrumentName, effects.size - 1);
    lastEffect.disconnect(outputNode);
    lastEffect.chain(newEffect.get('tone'), outputNode)
    this.setState({
      instruments: this.state.instruments.updateIn([instrumentName, 'effects'], arr => arr.push(newEffect)),
    })
  }

  removeEffect = (instrumentName, effectIndex) => {
    this.disconnectNode(instrumentName, effectIndex);
    this.setState({ instruments: this.state.instruments.deleteIn([instrumentName, 'effects', effectIndex]) });
  }

  disconnectNode = (instrumentName, index, dispose = true, connectToOutput = true) => {
    const inputNode = this.getInputNode(instrumentName, index);
    const tone = this.getTone(instrumentName, index);
    inputNode.disconnect(tone);
    if (connectToOutput) {
      inputNode.connect(this.getOutputNode(instrumentName, index))
    } else {
      tone.disconnect(this.getOutputNode(instrumentName, index))
    }
    return dispose ? tone.dispose() : tone;
  }

  connectNode = index => {
    const inputNode = this.getInputNode(index);
    const tone = this.getTone(index);
    inputNode.connect(tone);
    tone.connect(this.getOutputNode(index));
  }

  moveNode = (instrumentName, fromIndex, toIndex) => {
    const movingBack = fromIndex > toIndex;
    const inputSideIndex = movingBack ? toIndex : fromIndex
    const outputSideIndex = movingBack ? fromIndex : toIndex
    const nodes = [
      this.getInputNode(instrumentName, inputSideIndex),
      this.getTone(instrumentName, inputSideIndex),
      this.getTone(instrumentName, outputSideIndex),
      this.getOutputNode(instrumentName, outputSideIndex),
    ];
    nodes.forEach((node, i) => (i !== nodes.length -1 && node.disconnect(nodes[i+1])));
    [nodes[1], nodes[2]] = [nodes[2], nodes[1]]

    //TODO revisit this when adding moving beyond adjacent nodes
    nodes.forEach((node, i) => (i !== nodes.length -1 && node.connect(nodes[i+1])));
    this.setState(state => {
      const { instruments } = state;
      const fromEffect = instruments.getIn([instrumentName, 'effects', fromIndex]);
      const toEffect = instruments.getIn([instrumentName, 'effects', toIndex]);
      return ({
        instruments: instruments.withMutations(inst => inst.setIn([instrumentName, 'effects', toIndex], fromEffect).setIn([instrumentName, 'effects', fromIndex], toEffect)),
      })
    });
  }

  componentDidMount() {
    this.state.instruments.valueSeq().forEach(i => {
      const filter = i.getIn(['filter', 'tone']);
      const lfo = i.getIn(['lfo', 'tone']);
      const lfo1 = i.getIn(['lfo1', 'tone']);
      i.get('audioNode').chain(filter, i.get('instrumentOut'), ...i.get('effects').map(effect => effect.get('tone')), i.get('channelOut'), this.state.output);
      lfo.chain(i.get('lfoGain'), filter.frequency);
      lfo1.connect(i.get('lfo1Gain'), filter.Q);
    })
  }

  render() {
    return (
      <AudioContext.Provider value={this.state}>
        {this.props.children}
      </AudioContext.Provider>
    )
  }
}

export default AudioContext;

export const withAudioContext = withContextFactory(AudioContext, 'audioContext');