import React from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import Filter from '../Filter';
import LFO from '../LFO';
import { registerAudioNode, unregisterAudioNode } from '../../store/instruments/actions';
import { tonePresets } from '../../containers/Synth/presets';

const createSynthFromName = (name, voices = 4, preset = 0) => {
  switch(name) {
  case 'PluckSynth':
    return new Tone.PluckSynth(tonePresets[name][preset])
  default:
    return new Tone.PolySynth(voices, Tone[name], tonePresets[name][preset])
  }
}

class Synth extends React.PureComponent {

  constructor(props) {
    super(props);
    const { output, name } = this.props;
    this.synth = createSynthFromName(name);
    this.gain = new Tone.Gain();
    if (output) {
      this.gain.connect(output);
    }
  }

  componentDidMount() {
    this.props.registerAudioNode(this.props.instrument.get('id'), this.synth);
  }

  componentDidUpdate() {
    this.synth.set(this.props.preset.toJS())
  }

  componentWillUnmount() {
    this.synth.dispose();
    this.gain.dispose();
    this.props.unregisterAudioNode(this.props.instrument.get('id'));
  }

  render() {
    const { instrument } = this.props;
    return (
      <>
        <Filter
          input={this.synth}
          output={this.gain}
          preset={instrument.getIn(['filter', 'preset'])}
        >
          {filterNode => (
            <>
              <LFO
                preset={instrument.getIn(['lfo', 'preset'])}
                id={instrument.getIn(['lfo', 'id'])}
                output={filterNode.frequency}
              />
              <LFO
                preset={instrument.getIn(['lfo1', 'preset'])}
                id={instrument.getIn(['lfo1', 'id'])}
                output={filterNode.Q}
              />
            </>
          )}
        </Filter>
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

export default connect(stp, dtp)(Synth)