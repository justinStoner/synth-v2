import React from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import { selectInstruments } from '../../store/instruments/selectors';
import { convertFilterPresetToTone } from '../../utils/filters';

class Filter extends React.PureComponent {

  constructor(props) {
    super(props);
    const { preset, output, input } = this.props;
    this.filter = new Tone.Filter(convertFilterPresetToTone(preset.toJS()));
    input.connect(this.filter);
    this.filter.connect(output);
  }

  componentDidUpdate() {
    const { preset } = this.props;
    this.filter.set(convertFilterPresetToTone(preset.toJS()))
  }

  componentWillUnmount() {
    this.filter.dispose();
  }

  render() {
    const { preset } = this.props;
    return (
      <>
        {this.props.children(this.filter)}
      </>
    )
  }
}

const stp = state => ({
})

export default connect(stp)(Filter)