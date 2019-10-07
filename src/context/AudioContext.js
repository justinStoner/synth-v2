import React from 'react';
import Tone from 'tone';
import { OrderedMap, Map, List } from 'immutable';
import withContextFactory from './withContextFactory';
import { tonePresets, instrumentPresets } from '../containers/Synth/presets';
import { effectPresetsList, createLfo, effectPresets } from '../components/EffectChain/presets';
import TestSynth from '../containers/Synth/customSynths/TestSynth';

const context = new Tone.Context();

const AudioContext = React.createContext({
  context,
  instruments: List(),
  output: null,
  setInstrument: () => {},
  removeEffect: () => {},
  getTone: () => {},
  getPreset: () => {},
  getInputNode: () => {},
  getOutputNode: () => {},
  moveNode: () => {},
  addEffect: () => {},
  setEffect: () => {},
});

export class AudioContextContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      context,
      instruments: Map({
        AMSynth: Map({
          name: 'AMSynth',
          id: 'AMSynth',
          node: new Tone.PolySynth(4, Tone.AMSynth, tonePresets.AMSynth[0]),
          preset: instrumentPresets['AMSynth'](),
          effects: List(effectPresetsList.valueSeq().map(effect => effect())),
          lfo: createLfo(),
          lfo1: createLfo(1),
          filter: effectPresets.get('filter')(),
        }),
        FMSynth: Map({
          name: 'FMSynth',
          id: 'FMSynth',
          node: new Tone.PolySynth(4, Tone.AMSynth, tonePresets.AMSynth[0]),
          preset: instrumentPresets['FMSynth'](),
          effects: List(effectPresetsList.valueSeq().map(effect => effect())),
          lfo: createLfo(),
          lfo1: createLfo(1),
          filter: effectPresets.get('filter')(),
        }),
      }),
      output: Tone.Master,
      setInstrument: this.setInstrument,
      removeEffect: this.removeEffect,
      getTone: this.getTone,
      getPreset: this.getPreset,
      getInputNode: this.getPreset,
      getOutputNode: this.getPreset,
      moveNode: this.moveNode,
      addEffect: this.addEffect,
      setEffect: this.setEffect,
    }
  }

  setEffect = (instrumentName, fieldName) => (preset, tone, inputNode, outputNode, setTone) => (valueName, setToneEffect) => (event, value) => {
    const val = event && event.target && event.target.value ? event.target.value : value;
    setToneEffect && setToneEffect(tone, val, valueName, preset, inputNode, outputNode, setTone);
    this.setState({ instruments: this.state.instruments.setIn([instrumentName, fieldName, 'preset', valueName], val) });
  }

  setInstrument = (instrumentName, instrument) => {
    this.setState({ instrument: this.state.instruments.set(instrumentName, instrument) })
  }

  getInputNode = (instrumentName, index) => index === 0 ? this.state.instruments.getIn([instrumentName, 'node']) : this.state.instruments.getIn([instrumentName, 'effects', index -1, 'tone'])

  getOutputNode = (instrumentName, index) => index + 1 === this.state.instruments.getIn([instrumentName, 'effects']).size ? this.state.output : this.state.instruments.getIn([instrumentName, 'effects', index + 1, 'tone'])

  getTone = (instrumentName, index) => this.state.instruments.getIn([instrumentName, 'effects', index, 'tone'])

  getPreset = (instrumentName, index) => this.state.instruments.getIn([instrumentName, 'effects', index, 'preset'])

  updateInstrument = (instrumentName, newPreset) => {
    this.setState({ instruments: this.state.instruments.setIn([instrumentName, 'preset'], newPreset) })
  }

  addEffect = (instrumentName, newEffect) => {
    const effects = this.state.instruments.getIn([instrumentName, 'effects']);
    const lastEffect = effects.last().get('tone');
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
      i.get('node').chain(filter, ...i.get('effects').map(effect => effect.get('tone')), this.state.output);
      lfo.connect(filter.frequency);
      lfo.start()
      lfo1.connect(filter.Q);
      lfo1.start()
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