import React, { PureComponent } from 'react';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';
import KeyBoard from '../../components/KeyBoard/KeyBoard';
import Recorder from './Recorder'
import Track from './Track'
import PageContainer from '../../components/PageContainer';
import { withAudioContext } from '../../context/AudioContext';

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  keyboardContainer: {
    padding: theme.spacing(2),
  },
});

class Recording extends PureComponent {
  constructor(props) {
    super(props);
    const data = [];
    this.state = { data, blob: new Blob(data) };
  }

  getSelectedInstrument = () => this.props.audioContext.instruments.get(this.props.audioContext.selectedInstrument);

  noteOn = e => {
    const instrument = this.getSelectedInstrument();
    const audioNode = instrument.get('audioNode');
    const attack = audioNode.get('envelope').attakc;
    if (e.totalPlaying === 1) {
      instrument.getIn(['lfo', 'tone']).start();
      instrument.getIn(['lfo1', 'tone']).start();
      instrument.getIn(['lfoGain']).gain.linearRampToValueAtTime(1, attack);
      instrument.getIn(['lfo1Gain']).gain.linearRampToValueAtTime(1, attack);
    }
    audioNode.triggerAttack(e.name, undefined, e.velocity);
  }
  noteOff = e => {
    const instrument = this.getSelectedInstrument();
    const audioNode = instrument.get('audioNode');
    const release = audioNode.get('envelope').release;
    if (e.totalPlaying === 0) {
      instrument.getIn(['lfoGain']).gain.linearRampToValueAtTime(0, release);
      instrument.getIn(['lfo1Gain']).gain.linearRampToValueAtTime(0, release);
      instrument.getIn(['lfo', 'tone']).stop(release);
      instrument.getIn(['lfo1', 'tone']).stop(release);
    }
    audioNode.triggerRelease(e.name);
  }

  render() {
    const { classes, audioContext } = this.props;
    const instrument = this.getSelectedInstrument()
    return (
      <PageContainer>
        <Grid container spacing={1}>
          {audioContext.tracks.valueSeq().map((track, i) => (
            <Grid item xs={12}>
              <Track track={track} key={i} index={i} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Paper className={clsx(classes.paper, classes.keyboardContainer)}>
              <KeyBoard polyphonic={instrument.get('voices')} noteOff={this.noteOff} noteOn={this.noteOn} />
            </Paper>
          </Grid>
        </Grid>
      </PageContainer>
    )
  }
}

export default withAudioContext(withStyles(styles)(Recording));