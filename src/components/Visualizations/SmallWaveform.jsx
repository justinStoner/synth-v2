import React from 'react';
import Tone from 'tone';
import { withAudioContext } from '../../context/AudioContext';
import { withTheme } from '@material-ui/styles';

class SmallWaveform extends React.PureComponent {

  state = { buffer: [] }

  static defaultProps = {
    stereo: true,
  }

  color = 'rgba(0, 0, 0, 0.54)'

  fft = new Tone.FFT(32)

  async componentDidMount() {
    const canvas = this.canvasRef.current;
    canvas.width = canvas.clientWidth * 2
    canvas.height = canvas.clientHeight * 2
    this.context = canvas.getContext('2d');
    this.loop()
  }

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    const channels = props.stereo ? 2 : 1
    const audioNode = props.audioContext.instruments.getIn([props.input, 'instrumentOut']);
    audioNode.connect(this.fft);

  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animId)
  }

  getWidth = () => this.canvasRef.current.width

  loop(){
    this.animId = requestAnimationFrame(this.loop.bind(this))
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d')
    canvas.width = canvas.clientWidth * 2
    canvas.height = canvas.clientHeight * 2
    const width = canvas.width
    const height = canvas.height
    context.clearRect(0, 0, width, height)
    context.beginPath()
    const lineWidth = 2
    context.lineWidth = lineWidth
    context.lineCap = 'round'

    const fftValue = this.fft.getValue()
    context.fillStyle = this.props.theme.palette.secondary.A100
    context.globalAlpha = 0.3;
    fftValue.forEach((v, i) => {
      const x = Math.scale(i, 0, fftValue.length, 0, width)
      const barHeight = Math.clamp(Math.scale(v, -100, 0, 0, height), 0, height)
      const hue = parseInt(120 * (1 - ((barHeight * 7) / 255)), 10);
      context.fillStyle = 'hsl(' + hue + ',75%,50%)';
      context.fillRect(x, -(canvas.height/255) * v, 2, canvas.height)    })
  }

  render(){
    const { height, width } = this.props
    return (
      <canvas ref={this.canvasRef} style={{ height, width }}>
        Small waveform
      </canvas>
    )
  }

}

export default withTheme(withAudioContext(SmallWaveform));