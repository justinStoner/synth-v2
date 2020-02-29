import React from 'react';
import { connect } from 'react-redux';
import { selectAudioInstruments, selectInstruments } from '../../store/instruments/selectors';
import Channel from '../Channel';
import { selectOutput } from '../../store/appReducer';

class AudioRoot extends React.PureComponent {
  render() {
    const { instruments, audioInstruments, output } = this.props;
    return (
      <>
        {
          instruments.valueSeq().map(inst => (
            <Channel
              instrument={inst}
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
})

export default connect(stp)(AudioRoot);