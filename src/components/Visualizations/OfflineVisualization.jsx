import React from 'react';
import PT from 'prop-types';

export class OfflineVisualization extends React.Component {

  static propTypes = {
    altText: PT.string,
    min: PT.number,
    max: PT.number,
    color: PT.string,
    drawBackground: PT.func,
    buffer: PT.array,
  }

  static defaultProps = {
    altText: '',
    min: -1.1,
    max: 1.1,
    color: 'black',
    drawBackground: () => {},
    buffer: [],
  }

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  getWidth = () => this.canvasRef.current.width

  async componentDidUpdate(){
    const { drawBackground, buffer, max, min, color, draw } = this.props;
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d')
    const width = canvas.clientWidth * 2
    const height = canvas.clientHeight * 2
    canvas.width = width
    canvas.height = height
    context.clearRect(0, 0, width, height)
    //draw the background
    drawBackground(context, width, height)

    const lineWidth = 4
    context.lineWidth = lineWidth
    context.beginPath()
    buffer.forEach((v, i) => {
      if (draw) {
        draw(context, v, i, buffer, width, height, lineWidth)
      } else {
        const x = Math.scale(i, 0, buffer.length, lineWidth, width-lineWidth)
        const y = Math.scale(v, max, min, 0, height-lineWidth)
        i === 0 ? context.moveTo(x, y) : context.lineTo(x, y)
      }
    })
    context.lineCap = 'round'
    context.strokeStyle = color
    context.stroke()
  }

  render(){
    const { altText } = this.props
    return (
      <canvas ref={this.canvasRef} style={{ height: '100%', width: '100%' }}>
        {altText}
      </canvas>
    )
  }

}