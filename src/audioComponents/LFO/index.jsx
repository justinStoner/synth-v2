import React from 'react';
import Tone from 'tone';
import { registerAudioNode, unregisterAudioNode } from '../../store/instruments/actions';
import { connect } from 'react-redux';

class LFO extends React.PureComponent {

  constructor(props) {
    super(props)
    const { preset, output, id } = this.props;
    this.lfo  = new Tone.LFO(preset.toJS());
    this.gain = new Tone.Gain();
    this.lfo.chain(this.gain, output);
    this.lfo.start();
    this.props.registerAudioNode(id, this.lfo)
  }

  componentDidUpdate() {
    this.lfo.set(this.props.preset.toJS())
  }

  componentWillUnmount() {
    this.lfo.dispose();
    this.gain.dispose();
  }

  render() {
    return (
      <>

      </>
    )
  }
}

const stp = state => ({
})

const dtp = dispatch => ({
  registerAudioNode: (id, inst) => dispatch(registerAudioNode(id, inst)),
  unregisterAudioNode: id => dispatch(unregisterAudioNode(id)),
})

export default connect(stp, dtp)(LFO)