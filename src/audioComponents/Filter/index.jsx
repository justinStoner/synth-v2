import React from 'react';
import { connect } from 'react-redux';
import { selectInstruments } from '../../store/instruments/selectors';

class Filter extends React.PureComponent {

  componentDidMount() {
    const { filter, output } = this.props;
    filter.connect(output);
  }

  componentWillUnmount() {
    const { filter } = this.props;
    filter.dispose();
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

export default connect(stp)(Filter)