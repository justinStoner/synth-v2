import React, { PureComponent } from 'react';
import WaveSurver from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import Cursor from 'wavesurfer.js/dist/plugin/wavesurfer.cursor';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Stop from '@material-ui/icons/Stop';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import { withAudioContext } from '../../context/AudioContext';
import { instrumentNames } from '../Synth/presets';
import Meter from '../../components/Visualizations/Meter';
import Recorder from './Recorder';

const styles = theme => ({
  paper: {
    padding: theme.spacing(1),
    height: '100%',
  },
})

class Track extends PureComponent {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.timelineRef = React.createRef();
  }

  chunks = [];

  componentDidMount() {
    console.log(Timeline)
    this.waveSurfer = WaveSurver.create({
      container: this.canvasRef.current,
      waveColor: '#2196f3',
      progressColor: '#f44336',
      height: 64,
      fillParent: true,
      plugins: [
        Timeline.create({
          container: this.timelineRef.current,
          height: 10,
        }),
        Regions.create({
          dragSelection: {
            slop: 5,
          },
        }),
        Cursor.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            'background-color': '#000',
            color: '#fff',
            padding: '2px',
            'font-size': '10px',
          },
        }),
      ],
    });
    if (this.props.track.audioData) {
      this.waveSurfer.loadBlob(this.props.track.audioData)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.audioContext.isPlaying !== this.props.audioContext.isPlaying) {
      this.waveSurfer.playPause()
    }
  }

  render() {
    const { track, audioContext, index, classes } = this.props
    return (
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <Typography component="body2" color="inherit" noWrap>
              {track.get('title')}
              <Meter style={{ padding: '0px 6px', display: 'inline-block' }} barWidth={9} input={track.name} height={14} width={14} />
            </Typography>
            <div>
              <Recorder
                stream={audioContext.instruments.getIn([track.name, 'channelOut'])}
                onDataAvailable={e => this.chunks.push(e.data)}
                onStop={e => {
                  const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
                  this.waveSurfer.loadBlob(new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' }))
                  audioContext.setTrackData(index, 'audioData', blob);
                }}
                render={({ state, start, stop, pause, resume }) => (
                  <>
                    {
                      state !== 'recording' ?
                        (<IconButton size="small" onClick={() => {audioContext.setSelectedInstrument(track.name);start()}}>
                          <FiberManualRecord color='secondary' />
                        </IconButton>)
                        : (
                          (<IconButton size="small" onClick={() => {stop()}}>
                            <Stop color='secondary' />
                          </IconButton>)
                        )
                    }
                  </>
                )}
              />
              <IconButton size="small">
                {
                  !track.mute ? <VolumeOff /> : <VolumeUp />
                }
              </IconButton>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper className={classes.paper} style={{ position: 'relative' }}>
            <div ref={this.canvasRef}></div>
            <div ref={this.timelineRef}></div>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default withAudioContext(withStyles(styles)(Track));