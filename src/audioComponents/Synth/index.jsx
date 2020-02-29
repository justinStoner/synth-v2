import React from 'react';
import { connect } from 'react-redux';
import { selectInstruments } from '../../store/instruments/selectors';

class Synth extends React.PureComponent {

  componentDidMount() {
    const { synth, output } = this.props;
    synth.connect(output);
  }

  componentWillUnmount() {
    const { synth } = this.props;
    synth.dispose();
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

export default connect(stp)(Synth)