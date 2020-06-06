import React from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import { registerAudioNode, unregisterAudioNode } from '../../store/instruments/actions';
import * as acetone from '../../assets/audio/acetone-rhythm';
import * as casio from '../../assets/audio/casio-sk1';
import * as roland from '../../assets/audio/roland-tr-33';
import { List } from 'immutable';
import EffectChain from '../EffectChain';

class Sequencer extends React.PureComponent {

  constructor(props) {
    super(props);
    const { output } = this.props;
    this.state = {};
    this.gain = new Tone.Gain();
    this.drums = { ...acetone, ...casio, ...roland };
    this.player = new Tone.Players(this.drums, () => this.setState({ loaded: true }));
    if (output) {
      this.gain.connect(output);
    }
  }

  componentDidMount() {
    this.props.registerAudioNode(this.props.instrument.get('id'), this.player);
  }

  componentDidUpdate() {
    this.player.set(this.props.preset.toJS())
  }

  componentWillUnmount() {
    this.player.dispose();
    this.gain.dispose();
    this.props.unregisterAudioNode(this.props.instrument.get('id'));
  }

  render() {
    const { instrument } = this.props;
    return (
      <>
        {this.state.loaded && Object.keys(this.drums).map(drum => (
          <EffectChain
            key={drum}
            input={this.player.get(drum)}
            output={this.gain}
            effects={new List()}
          />
        ))}
        {this.props.children(this.gain)}
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

export default connect(stp, dtp)(Sequencer)