import React from 'react';
import Tone from 'tone';
import { WaveForms } from '../../utils/waveforms';
import { withTheme } from '@material-ui/core';

class WaveForm extends React.PureComponent {

  constructor(props){
    super(props)

    this.analyser = new Tone.Waveform(256)

    this.fft = new Tone.FFT(256)

    this.canvasRef = React.createRef();

    this.containerRef = React.createRef();

    this.props.source.connect(this.analyser)

    this.props.source.connect(this.fft)

    this.animId = null;
  }

  componentDidMount(){
    this.loop()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animId)
  }

  loop(){
    this.animId = requestAnimationFrame(this.loop.bind(this))
    const canvas = this.canvasRef.current;
    const conatiner = this.containerRef.current;
    const context = canvas.getContext('2d')
    canvas.width = conatiner.clientWidth
    canvas.height = conatiner.clientHeight * 3
    const value = this.analyser.getValue()
    const width = canvas.width
    const height = canvas.height
    context.clearRect(0, 0, width, height)
    context.beginPath()
    const lineWidth = 2
    context.lineWidth = lineWidth
    value.forEach((v, i) => {
      const x = Math.scale(i, 0, value.length, 0, width)
      const y = Math.scale(v, -0.4, 0.4, 0, height)
      i === 0 ? context.moveTo(x, y) : context.lineTo(x, y)
    })
    context.lineCap = 'round'
    context.strokeStyle = this.props.theme.palette.primary[500]
    context.stroke()

    const fftValue = this.fft.getValue()
    context.fillStyle = this.props.theme.palette.secondary.A100
    context.globalAlpha = 0.3;
    fftValue.forEach((v, i) => {
      const x = Math.scale(i, 0, fftValue.length, 0, width)
      const barHeight = Math.clamp(Math.scale(v, -100, 0, 0, height), 0, height)
      const hue = parseInt(120 * (1 - ((barHeight * 7) / 255)), 10);
      context.fillStyle = 'hsl(' + hue + ',75%,50%)';
      context.fillRect(x, -(canvas.height/255) * v, 2, canvas.height)
      //context.fill()
    })
  }

  render(){
    return (
      <div ref={this.containerRef} style={{ height: '20px', marginBottom: '20px' }}>
        <canvas ref={this.canvasRef}></canvas>
      </div>
    )
  }

}

export default withTheme(WaveForm);