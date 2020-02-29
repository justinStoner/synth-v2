import React from 'react';
import Tone from 'tone';
import { OrderedMap, Map, List, Record } from 'immutable';
import withContextFactory from './withContextFactory';
import instrumentPresets, { tonePresets, instrumentNames } from '../containers/Synth/presets';
import { effectPresetsList, createLfo, effectPresets } from '../components/EffectChain/presets';
import TestSynth from '../containers/Synth/customSynths/TestSynth';
import { createSampleNote } from '../utils';

const context = new Tone.Context();

const AudioContext = React.createContext({
  BPM: 120,
  BPMe: 4,
  SPB: 4,
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
  setSample: () => {},
  addSample: () => {},
  selectedInstrument: 'DuoSynth',
  tracks: List(),
  samples: List(),
});

export const Sample = new Record({
  id: 0,
  sampleId: 0,
  index: 0,
  row: 0,
  key: 0,
  title: 'item 1',
  start: 1,
  stepStart: 1,
  end: 4,
  stepEnd: 4,
  time: 0,
  endTime: 0,
  duration: 0,
  instrument: null,
  notes: [],
  velocity: 1,
  volume: 0,
})

const notes = ['C3', 'E3', 'G3', 'B3', 'C4', 'B3', 'G3', 'E3']

const notes1 = ['B2', 'E3', 'G3', 'B3', 'C4', 'B3', 'G3', 'E3']


const SPB = 4;

const Track = new Record({
  volume: 0,
  pan: 0,
  id: 0,
  mute: false,
  solo: false,
  name: '',
  title: '',
  recording: false,
  audioData: null,
})

export class AudioContextContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      context,
      BPM: 120,
      BPMe: 4,
      SPB: 4,
      // samples: List([
      //   Sample({
      //     id: 0,
      //     row: 0,
      //     key: 0,
      //     index: 0,
      //     title: 'item 1',
      //     start: 1,
      //     end: 3,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '0:0',
      //     endTime: '1:3',
      //     instrument: 'AMSynth',
      //     notes: new List(notes.map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return new Sample({
      //         id: note,
      //         sampleId: 0,
      //         row: note,
      //         key: n + i,
      //         title: n,
      //         index: i,
      //         start: 1 + Math.floor((i + 1) / SPB),
      //         end: 1 + Math.floor((i + 2) / SPB),
      //         stepStart: Math.floor((i + 1) % SPB),
      //         stepEnd: Math.floor((i + 2) % SPB),
      //         time: `${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`,
      //         endTime: `${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`,
      //         duration: Tone.Ticks(Tone.Time(`${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`).toTicks()).toNotation(),
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 0,
      //     row: 0,
      //     key: 0,
      //     index: 1,
      //     title: 'item 1',
      //     start: 3,
      //     end: 5,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '2:0',
      //     endTime: '3:3',
      //     instrument: 'AMSynth',
      //     notes: new List(notes.map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return new Sample({
      //         id: note,
      //         sampleId: 1,
      //         row: note,
      //         key: n + i,
      //         title: n,
      //         index: i,
      //         start: 1 + Math.floor((i + 1) / SPB),
      //         end: 1 + Math.floor((i + 2) / SPB),
      //         stepStart: Math.floor((i + 1) % SPB),
      //         stepEnd: Math.floor((i + 2) % SPB),
      //         time: `${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`,
      //         endTime: `${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`,
      //         duration: Tone.Ticks(Tone.Time(`${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`).toTicks()).toNotation(),
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 0,
      //     row: 0,
      //     key: 0,
      //     index: 2,
      //     title: 'item 1',
      //     start: 5,
      //     end: 7,
      //     stepEnd: 2,
      //     stepStart: 1,
      //     time: '4:0',
      //     endTime: '5:3',
      //     instrument: 'AMSynth',
      //     notes: new List(notes.map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return new Sample({
      //         id: note,
      //         sampleId: 2,
      //         row: note,
      //         key: n + i,
      //         title: n,
      //         index: i,
      //         start: 1 + Math.floor((i + 1) / SPB),
      //         end: 1 + Math.floor((i + 2) / SPB),
      //         stepStart: Math.floor((i + 1) % SPB),
      //         stepEnd: Math.floor((i + 2) % SPB),
      //         time: `${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`,
      //         endTime: `${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`,
      //         duration: Tone.Ticks(Tone.Time(`${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`).toTicks()).toNotation(),
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 0,
      //     row: 0,
      //     key: 0,
      //     index: 3,
      //     title: 'item 1',
      //     start: 7,
      //     end: 9,
      //     stepEnd: 1,
      //     time: '6:0',
      //     endTime: '7:3',
      //     instrument: 'AMSynth',
      //     notes: new List(notes.map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return new Sample({
      //         id: note,
      //         sampleId: 3,
      //         row: note,
      //         key: n + i,
      //         title: n,
      //         index: i,
      //         start: 1 + Math.floor((i + 1) / SPB),
      //         end: 1 + Math.floor((i + 2) / SPB),
      //         stepStart: Math.floor((i + 1) % SPB),
      //         stepEnd: Math.floor((i + 2) % SPB),
      //         time: `${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`,
      //         endTime: `${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`,
      //         duration: Tone.Ticks(Tone.Time(`${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`).toTicks()).toNotation(),
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 0,
      //     row: 0,
      //     key: 0,
      //     index: 4,
      //     title: 'item 1',
      //     start: 9,
      //     end: 11,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '8:0',
      //     endTime: '9.3',
      //     instrument: 'AMSynth',
      //     notes: new List(notes1.map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return new Sample({
      //         id: note,
      //         sampleId: 4,
      //         row: note,
      //         key: n + i,
      //         title: n,
      //         index: i,
      //         start: 1 + Math.floor((i + 1) / SPB),
      //         end: 1 + Math.floor((i + 2) / SPB),
      //         stepStart: Math.floor((i + 1) % SPB),
      //         stepEnd: Math.floor((i + 2) % SPB),
      //         time: `${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`,
      //         endTime: `${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`,
      //         duration: Tone.Ticks(Tone.Time(`${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`).toTicks()).toNotation(),
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 0,
      //     row: 0,
      //     key: 0,
      //     index: 5,
      //     title: 'item 1',
      //     start: 11,
      //     end: 13,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '10:0',
      //     endTime: '11:3',
      //     instrument: 'AMSynth',
      //     notes: new List(notes1.map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return new Sample({
      //         id: note,
      //         sampleId: 5,
      //         row: note,
      //         key: n + i,
      //         title: n,
      //         index: i,
      //         start: 1 + Math.floor((i + 1) / SPB),
      //         end: 1 + Math.floor((i + 2) / SPB),
      //         stepStart: Math.floor((i + 1) % SPB),
      //         stepEnd: Math.floor((i + 2) % SPB),
      //         time: `${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`,
      //         endTime: `${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`,
      //         duration: Tone.Ticks(Tone.Time(`${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`).toTicks()).toNotation(),
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 0,
      //     row: 0,
      //     key: 0,
      //     index: 6,
      //     title: 'item 1',
      //     start: 13,
      //     end: 15,
      //     stepEnd: 2,
      //     stepStart: 1,
      //     time: '12:0',
      //     endTime: '13:3',
      //     instrument: 'AMSynth',
      //     notes: new List(notes1.map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return new Sample({
      //         id: note,
      //         sampleId: 6,
      //         row: note,
      //         key: n + i,
      //         title: n,
      //         index: i,
      //         start: 1 + Math.floor((i + 1) / SPB),
      //         end: 1 + Math.floor((i + 2) / SPB),
      //         stepStart: Math.floor((i + 1) % SPB),
      //         stepEnd: Math.floor((i + 2) % SPB),
      //         time: `${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`,
      //         endTime: `${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`,
      //         duration: Tone.Ticks(Tone.Time(`${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`).toTicks()).toNotation(),
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 0,
      //     row: 0,
      //     key: 0,
      //     index: 7,
      //     title: 'item 1',
      //     start: 15,
      //     end: 17,
      //     stepEnd: 1,
      //     time: '14:0',
      //     endTime: '15:3',
      //     instrument: 'AMSynth',
      //     notes: new List(notes1.map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return new Sample({
      //         id: note,
      //         sampleId: 7,
      //         row: note,
      //         key: n + i,
      //         title: n,
      //         index: i,
      //         start: 1 + Math.floor((i + 1) / SPB),
      //         end: 1 + Math.floor((i + 2) / SPB),
      //         stepStart: Math.floor((i + 1) % SPB),
      //         stepEnd: Math.floor((i + 2) % SPB),
      //         time: `${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`,
      //         endTime: `${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`,
      //         duration: Tone.Ticks(Tone.Time(`${Math.floor((i + 2) / SPB)}:${Math.floor((i + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((i + 1) / SPB)}:${Math.floor((i + 1) % SPB)}`).toTicks()).toNotation(),
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 1,
      //     row: 1,
      //     key: 1,
      //     index: 8,
      //     title: 'item 2',
      //     start: 1,
      //     end: 3,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '0:0',
      //     endTime: '1:3',
      //     instrument: 'FMSynth',
      //     // G2 B2 E3
      //     notes: new List(['E2', 'G2', 'B2'].map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return createSampleNote({
      //         SPB,
      //         sampleId: 8,
      //         title: n,
      //         note,
      //         index: i,
      //         start: 1,
      //         end: 9 * 4,
      //         stepEnd: 2,
      //         velocity: 0.5,
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 1,
      //     row: 1,
      //     key: 1,
      //     index: 9,
      //     title: 'item 2',
      //     start: 3,
      //     end: 5,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '2:0',
      //     endTime: '3:3',
      //     instrument: 'FMSynth',
      //     notes: new List(['E2', 'G2', 'B2'].map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return createSampleNote({
      //         SPB,
      //         sampleId: 9,
      //         title: n,
      //         note,
      //         index: i,
      //         start: 1,
      //         end: 9 * 4,
      //         stepEnd: 2,
      //         velocity: 0.5,
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 1,
      //     row: 1,
      //     key: 1,
      //     index: 10,
      //     title: 'item 2',
      //     start: 5,
      //     end: 7,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '4:0',
      //     endTime: '5:3',
      //     instrument: 'FMSynth',
      //     notes: new List(['E2', 'G2', 'B2'].map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return createSampleNote({
      //         SPB,
      //         sampleId: 10,
      //         title: n,
      //         note,
      //         index: i,
      //         start: 1,
      //         end: 9 * 4,
      //         stepEnd: 2,
      //         velocity: 0.5,
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 1,
      //     row: 1,
      //     key: 1,
      //     index: 11,
      //     title: 'item 2',
      //     start: 7,
      //     end: 9,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '6:0',
      //     endTime: '7:3',
      //     instrument: 'FMSynth',
      //     notes: new List(['E2', 'G2'].map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return createSampleNote({
      //         SPB,
      //         sampleId: 1,
      //         title: n,
      //         note,
      //         index: i,
      //         start: 1,
      //         end: 9 * 4,
      //         stepEnd: 2,
      //         velocity: 0.5,
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 1,
      //     row: 1,
      //     key: 1,
      //     index: 12,
      //     title: 'item 2',
      //     start: 9,
      //     end: 11,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '8:0',
      //     endTime: '9.3',
      //     instrument: 'FMSynth',
      //     notes: new List(['B2', 'G2', 'E3'].map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return createSampleNote({
      //         SPB,
      //         sampleId: 2,
      //         title: n,
      //         note,
      //         index: i,
      //         start: 1,
      //         end: 9 * 4,
      //         stepEnd: 2,
      //         velocity: 0.5,
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 1,
      //     row: 1,
      //     key: 1,
      //     index: 13,
      //     title: 'item 2',
      //     start: 11,
      //     end: 13,
      //     stepEnd: 1,
      //     stepStart: 1,
      //     time: '10:0',
      //     endTime: '11:3',
      //     instrument: 'FMSynth',
      //     notes: new List(['B2', 'G2', 'E3'].map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return createSampleNote({
      //         SPB,
      //         sampleId: 13,
      //         title: n,
      //         note,
      //         index: i,
      //         start: 1,
      //         end: 9 * 4,
      //         stepEnd: 2,
      //         velocity: 0.5,
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 1,
      //     row: 1,
      //     key: 1,
      //     index: 14,
      //     title: 'item 2',
      //     start: 13,
      //     end: 15,
      //     stepEnd: 2,
      //     stepStart: 1,
      //     time: '12:0',
      //     endTime: '13:3',
      //     instrument: 'FMSynth',
      //     notes: new List(['B2', 'G2', 'E3'].map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return createSampleNote({
      //         SPB,
      //         sampleId: 4,
      //         title: n,
      //         note,
      //         index: i,
      //         start: 1,
      //         end: 9 * 4,
      //         stepEnd: 2,
      //         velocity: 0.5,
      //       })
      //     })),
      //   }),
      //   Sample({
      //     id: 1,
      //     row: 1,
      //     key: 1,
      //     index: 15,
      //     title: 'item 2',
      //     start: 15,
      //     end: 17,
      //     stepEnd: 1,
      //     time: '14:0',
      //     endTime: '15:3',
      //     instrument: 'FMSynth',
      //     notes: new List(['E2', 'G2', 'B2'].map((n, i) => {
      //       const note = Tone.Frequency(n).toMidi()
      //       return createSampleNote({
      //         SPB,
      //         sampleId: 15,
      //         title: n,
      //         note,
      //         index: i,
      //         start: 1,
      //         end: 9 * 4,
      //         stepEnd: 2,
      //         velocity: 0.5,
      //       })
      //     })),
      //   }),
      // ]),
      // tracks: List(instrumentNames.map((i, index) => new Track({ volume: i.value === 'DuoSynth' ? -10 : 0, id: index, name: i.value, title: i.label }))),
      // selectedInstrument: 'DuoSynth',
      // isPlaying: false,
      // output: Tone.Master,
      // setInstrument: this.setInstrument,
      // updateInstrument: this.updateInstrument,
      // removeEffect: this.removeEffect,
      // getTone: this.getTone,
      // getPreset: this.getPreset,
      // getInputNode: this.getPreset,
      // getOutputNode: this.getPreset,
      // moveNode: this.moveNode,
      // addEffect: this.addEffect,
      // setEffect: this.setEffect,
      // setSelectedInstrument: this.setSelectedInstrument,
      // setTrackData: this.setTrackData,
      // setIsPlaying: this.setIsPlaying,
      // setSample: this.setSample,
      // addSample: this.addSample,
    }
  }

  addSample = sample => {
    this.setState({ samples: this.state.samples.push(sample) })
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

  setSample = (index, sample) => {
    const newSample = this.state.samples.mergeIn([index], sample);
    console.log(sample, newSample.get(index).toJS())
    this.setState({ samples: newSample })
  }

  componentDidMount() {
    // this.state.instruments.valueSeq().forEach(i => {
    //   const filter = i.getIn(['filter', 'tone']);
    //   const lfo = i.getIn(['lfo', 'tone']);
    //   const lfo1 = i.getIn(['lfo1', 'tone']);
    //   i.get('audioNode').chain(filter, i.get('instrumentOut'), ...i.get('effects').map(effect => effect.get('tone')), i.get('channelOut'), this.state.output);
    //   lfo.chain(i.get('lfoGain'), filter.frequency);
    //   lfo1.connect(i.get('lfo1Gain'), filter.Q);
    // })
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