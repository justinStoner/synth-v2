import React from 'react';
import { connect } from 'react-redux';
import { selectInstruments } from '../../store/instruments/selectors';

class LFO extends React.PureComponent {

  componentDidMount() {
    const { lfo, gain, output } = this.props;
    lfo.chain(gain, output);
  }

  componentWillUnmount() {
    const { lfo, gain } = this.props;
    lfo.dispose();
    gain.dispose();
  }

  render() {
    const { preset } = this.props;
    return (
      <>

      </>
    )
  }
}

const stp = state => ({
})

export default connect(stp)(LFO)