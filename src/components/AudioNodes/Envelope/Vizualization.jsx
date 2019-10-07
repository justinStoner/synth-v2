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
    const { envelope } = this.props;
    const options = envelope.get()
    const padding = 0.001
    const scalar = 1
    const totalTime = options.attack + options.decay + options.release
    const sustain = 0.01
    const buffer = await Tone.Offline(() => {
      const clone = new Tone.Envelope().toMaster()
      clone.set(options)
      clone.attack *= scalar
      clone.decay *= scalar
      clone.release *= scalar
      clone.toMaster()
      clone.triggerAttack(padding)
      clone.triggerRelease((options.attack + options.decay + sustain)*scalar + padding)
    }, (totalTime + sustain)*scalar + padding * 2)
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