import React from 'react';
import Tone from 'tone';
import CardVisualization from '../../Visualizations/CardVisualization';
import { OfflineVisualization } from '../../Visualizations/OfflineVisualization';
import { withTheme } from '@material-ui/styles';

class Visuzliation extends React.Component {

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
    const { oscillator } = this.props;
    const options = oscillator.get()
    const buffer = await Tone.Offline(() => {
      const clone = new Tone.OmniOscillator(options)
      clone.frequency.value = 200
      clone.detune.value = 0
      clone.volume.value = 0
      clone.toMaster().start(0).stop(0.005)
    }, 0.005)
    return buffer.toArray(0)
  }

  render() {
    return (
      <CardVisualization>
        <OfflineVisualization color={this.props.theme.palette.primary[500]} altText="oscillator waveform" min={-1.1} max={1.1} buffer={this.state.buffer} />
      </CardVisualization>
    )
  }

}

export default withTheme(Visuzliation);