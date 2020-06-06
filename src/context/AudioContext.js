import React from 'react';
import Tone from 'tone';
import { Record } from 'immutable';
import withContextFactory from './withContextFactory';

const context = new Tone.Context();

const AudioContext = React.createContext({
  BPM: 120,
  BPMe: 4,
  SPB: 4,
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

export class AudioContextContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      context,
      BPM: 120,
      BPMe: 4,
      SPB: 4,
    }
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