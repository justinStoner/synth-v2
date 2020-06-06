import React from 'react';
import { connect } from 'react-redux';
import { selectAudioInstruments, selectInstruments } from '../../store/instruments/selectors';
import Channel from '../Channel';
import { selectOutput } from '../../store/appReducer';
import { selectTracks } from '../../store/tracks/selectors';

class AudioRoot extends React.PureComponent {
  render() {
    const { instruments, audioInstruments, output, tracks } = this.props;
    return (
      <>
        {
          instruments.valueSeq().map(inst => (
            <Channel
              instrument={inst}
              track={tracks.get(inst.trackId)}
              key={inst.id}
              audioInstrument={audioInstruments.get(inst.id)}
              output={output}
            />
          ))
        }
      </>
    )
  }
}

const stp = state => ({
  instruments: selectInstruments(state),
  audioInstruments: selectAudioInstruments(state),
  output: selectOutput(state),
  tracks: selectTracks(state),
})

export default connect(stp)(AudioRoot);