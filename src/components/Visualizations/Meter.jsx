import React from 'react';
import Tone from 'tone';
import { withAudioContext } from '../../context/AudioContext';
import { withTheme } from '@material-ui/styles';
import { withStyles, InputLabel } from '@material-ui/core';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import { connect } from 'react-redux';
import { selectInstruments, selectAudioInstruments } from '../../store/instruments/selectors';

const styles = theme => ({
  level: {
    flexGrow: 1,
    fontSize: '10px',
    textSlign: 'center',
  },
})

class Meter extends React.PureComponent {

  static defaultProps = {
    stereo: true,
    showLabels: false,
    color: 'rgba(0, 0, 0, 0.54)',
  }

  async componentDidMount() {
    this.loop()
  }

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      levels: props.showLabels ?
        (props.stereo ? [-Infinity, -Infinity] : [-Infinity]) :
        [],
    }
    const channels = props.stereo ? 2 : 1
    const audioNode = props.instruments.getIn([props.input, 'instrumentOut']);
    if (props.stereo){
      const split = new Tone.Split()
      audioNode.connect(split)
      this.meters = [new Tone.Meter(0.9), new Tone.Meter(0.9)]
      split.left.connect(this.meters[0])
      split.right.connect(this.meters[1])
    } else {
      this.meters = [new Tone.Meter(0.9)]
      audioNode.connect(this.meters[0])
    }

  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animId)
  }

  getWidth = () => this.canvasRef.current.width

  loop(){
    const { theme } = this.props;
    this.animId = requestAnimationFrame(this.loop.bind(this))
    const canvas = this.canvasRef.current;
    const context = canvas.getContext('2d');
    const width = canvas.clientWidth * 2
    const height = canvas.clientHeight * 2
    canvas.width = width
    canvas.height = height
    const values = this.meters.map(m => m.getLevel())
    const barHeights = values.map(value => Math.clamp(Math.scale(value, -100, 6, 0, height), 0, height))
    context.clearRect(0, 0, width, height)
    const barWidth = this.props.barWidth || width / this.meters.length
    const margin = this.meters.length > 1 ? 3 : 0
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(1, green['A700']);
    gradient.addColorStop(0, yellow['500']);
    barHeights.forEach((barHeight, i) => {
      context.fillStyle = this.props.color;
      context.fillRect(i * barWidth + margin * i, 0, barWidth - margin, height)
      context.fillStyle = gradient;
      context.fillRect(i * barWidth + margin*i, height - barHeight, barWidth - margin, barHeight);
    });
    if (this.props.showLabels){
      this.setState({ levels: this.state.levels.map((val, i) => values[i] < -100 ? -Infinity.toFixed(2) : values[i].toFixed(2)) })
    }
  }

  render(){
    const { height, width, level, stereo, classes, style } = this.props
    const { levels } = this.state;
    return (
      <div style={style}>
        <canvas ref={this.canvasRef} style={{ height, width }}>
          Meter
        </canvas>
        {
          this.props.showLabels &&
          (
            <div style={{
              height: '10px',
              lineHeight: '10px',
              display: 'flex',
            }}>
              {
                this.state.levels.length > 1 ?
                <>
                  <span className={classes.level}>{levels[0]}</span>
                  <span className={classes.level}>{levels[1]}</span>
                </>
                  :
                  <span className={classes.level}>{levels[1]}</span>
              }
            </div>
          )
        }
      </div>
    )
  }

}

const mapStateToProps = state => ({
  instruments: selectAudioInstruments(state),
})

export default withTheme(withStyles(styles)(connect(mapStateToProps)(Meter)));