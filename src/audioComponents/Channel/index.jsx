import React from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import { registerAudioNode, unregisterAudioNode } from '../../store/instruments/actions';
import Synth from '../Synth';
import Sequencer from '../Sequencer';
import EffectChain from '../EffectChain';

class Channel extends React.PureComponent {

  constructor(props) {
    super(props);
    const { output, track } = this.props;
    this.channelOut = new Tone.Channel();
    this.channelOut.set({ volume: track.volume })
    this.channelOut.connect(output);
  }

  componentDidMount() {
    this.props.registerAudioNode(this.props.instrument.get('channelOut'), this.channelOut);
  }

  componentDidUpdate() {
    const { track } = this.props;
    this.channelOut.set({ volume: track.volume })
  }

  componentWillUnmount() {
    this.channelOut.dispose();
  }

  render() {
    const { instrument } = this.props;
    return (
      <>
        {
          instrument.get('type') === 'synth' ?
            <Synth
              preset={instrument.get('preset')}
              name={instrument.get('name')}
              instrument={instrument}
            >
              {synth => (
                <EffectChain
                  input={synth}
                  output={this.channelOut}
                  effects={instrument.effects}
                />
              )}
            </Synth> :
            <Sequencer
              preset={instrument.get('preset')}
              name={instrument.get('name')}
              instrument={instrument}
            >
              {sequencer => (
                <EffectChain
                  input={sequencer}
                  output={this.channelOut}
                  effects={instrument.effects}
                />
              )}
            </Sequencer>
        }
      </>
    )
  }
}

const dtp = dispatch => ({
  registerAudioNode: (id, inst) => dispatch(registerAudioNode(id, inst)),
  unregisterAudioNode: id => dispatch(unregisterAudioNode(id)),
})

export default connect(undefined, dtp)(Channel)