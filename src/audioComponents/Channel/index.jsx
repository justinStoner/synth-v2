import React from 'react';
import { connect } from 'react-redux';
import { selectInstruments } from '../../store/instruments/selectors';
import Synth from '../Synth';
import Filter from '../Filter';
import LFO from '../LFO';
import EffectChain from '../EffectChain';

class Channel extends React.PureComponent {

  componentDidMount() {
    const { audioInstrument, output } = this.props;
    audioInstrument.channelOut.connect(output);
  }

  componentWillUnmount() {
    const { audioInstrument } = this.props;
    audioInstrument.channelOut.dispose();
  }

  render() {
    const { audioInstrument, instrument } = this.props;
    const filter = audioInstrument.filter;
    return (
      <>
        <Synth preset={instrument.get('preset')} name={instrument.get('name')} synth={audioInstrument.instrument} output={audioInstrument.filter} />
        <Filter filter={filter} output={audioInstrument.instrumentOut} />
        <LFO lfo={audioInstrument.lfo} gain={audioInstrument.lfoGain} output={filter.frequency} />
        <LFO lfo={audioInstrument.lfo1} gain={audioInstrument.lfo1Gain} output={filter.Q} />
        <EffectChain
          input={audioInstrument.instrumentOut}
          output={audioInstrument.channelOut}
          effects={instrument.effects}
          audioEffects={audioInstrument.effects}
        />
      </>
    )
  }
}

const stp = state => ({
})

export default connect(stp)(Channel)