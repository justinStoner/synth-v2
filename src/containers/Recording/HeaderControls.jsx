import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tone from 'tone';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
import FastRewind from '@material-ui/icons/FastRewind';
import FastForward from '@material-ui/icons/FastForward';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withAudioContext } from '../../context/AudioContext';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const play = (audioContext, samples) => {
  samples.forEach(sample => {
    if (sample.notes.size > 0) {
      const sampleOffset = Tone.Time(sample.time).toTicks()
      const samples = sample.notes.map((note, i) => ({
        time: note.time,
        endTime: note.endTime,
        duration: note.duration,
        note: note.title,
        velocity: note.velocity,
      })).toJS();
      console.log(samples);
      const part = new Tone.Part(function(time, value) {
        const instrument = audioContext.instruments.get(sample.instrument).get('audioNode');
        console.log(value.duration);
        instrument.triggerAttackRelease(value.note, value.duration, time, value.velocity)
      }, samples).start(sample.time);
      part.humanize = true;
      const filter = audioContext.instruments.getIn([sample.instrument, 'filter', 'tone']);
      if (filter && sample.instrument === 'AMSynth') {
        filter.frequency.setValueAtTime(50, 0);
        filter.frequency.linearRampToValueAtTime(2000, 20);
      }
      if (filter && sample.instrument === 'FMSynth') {
        filter.Q.setValueAtTime(2000, 20);
        filter.Q.linearRampToValueAtTime(2000, 20);
        const output = audioContext.instruments.getIn([sample.instrument, 'instrumentOut']);
        output.gain.setValueAtTime(15, 20);
        output.gain.linearRampToValueAtTime(15, 20);
      }
      // Tone.Transport.schedule(function(time) {
      //   filter.frequency.linearRampToValueAtTime(450, 20);
      //   filter.frequency.setValueAtTime(audioContext.instruments.getIn([sample.instrument, 'filter', 'preset', 'frequency', 20]))
      // }, 20);
      // part.loopEnd = '2:1';
      // part.loopStart = '0:1';
      // part.loop = 5;
      console.log(part);
    }
  });
  Tone.Transport.bpm.value = 180 * 1.5;
  Tone.Transport.start('+0.1');
  audioContext.setIsPlaying()
}

const stop = audioContext => {
  Tone.Transport.cancel();
  Tone.Transport.stop();
  audioContext.setIsPlaying()
}

const HeaderControls = ({ audioContext }) => {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = event => {
    setAuth(event.target.checked);
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Toolbar>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <FastRewind />
      </IconButton>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        {audioContext.isPlaying ? <PauseCircleFilled onClick={() => {stop(audioContext)}} /> : <PlayCircleFilled onClick={() => {play(audioContext, audioContext.samples)}} />}
      </IconButton>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <FastForward />
      </IconButton>
    </Toolbar>
  )
}

export default withAudioContext(HeaderControls);