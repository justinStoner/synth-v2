import React from 'react';
import Tone from 'tone';
import { OfflineVisualization } from '../../Visualizations/OfflineVisualization';
import { withTheme } from '@material-ui/styles';
import CardVisualization from '../../Visualizations/CardVisualization';

class Visualization extends React.Component {

  state = { buffer: [] }

  async componentDidMount() {
    const buffer = await this.getBuffer();
    this.setState({ buffer })
  }

  async componentDidUpdate(prevprops) {
    if (prevprops.preset !== this.props.preset) {
      const buffer = await this.getBuffer();
      this.setState({ buffer })
    }
  }

  getBuffer = async () => {
    const { compressor, preset } = this.props;
    const options = preset.toJS()

    const padding = 0.001
    const scalar = 1
    const totalTime = options.attack + options.release
    const sustain = 0.01
    const buffer = await Tone.Offline(() => {
      const clone = new Tone.Compressor(options)
      const osc = new Tone.Oscillator();
      clone.toMaster()
      osc.connect(clone).start(0).stop((totalTime + sustain)*scalar + padding * 4);
    },(totalTime + sustain)*scalar + padding)
    return buffer.toArray(0)
  }

  render() {
    return (
      <CardVisualization>
        <OfflineVisualization color={this.props.theme.palette.primary[500]} altText="envelope curve" min={0} max={1.1} duration={0.1} buffer={this.state.buffer} />
      </CardVisualization>
    )
  }
}

export default withTheme(Visualization);