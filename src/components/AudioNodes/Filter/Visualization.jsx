import React from 'react';
import Tone from 'tone';
import { OfflineVisualization } from '../../Visualizations/OfflineVisualization';
import { withTheme } from '@material-ui/styles';
import CardVisualization from '../../Visualizations/CardVisualization';

class Visualization extends React.Component {

  state = { buffer: [], min: 0, max: 0 }

  async componentDidMount() {
    const buffer = await this.getBuffer();
    this.setState({ buffer, min: Math.floor(Math.min(...buffer)), max: Math.ceil(Math.max(...buffer)) })
  }

  async componentDidUpdate(prevprops) {
    if (prevprops.preset !== this.props.preset) {
      const buffer = await this.getBuffer();
      this.setState({ buffer, min: Math.floor(Math.min(...buffer)), max: Math.ceil(Math.max(...buffer)) })
    }
  }

  getBuffer = async () => {
    const { filter, preset } = this.props;
    const clone = new Tone.Filter();
    clone.set(filter.get());
    const magResponse = clone.getFrequencyResponse(100);
    clone.dispose();
    return magResponse
  }

  render() {
    return (
      <CardVisualization>
        <OfflineVisualization color={this.props.theme.palette.primary[500]} altText="envelope curve" min={0} max={this.state.max} duration={0.1} buffer={this.state.buffer} />
      </CardVisualization>
    )
  }
}

export default withTheme(Visualization);