import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
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
        {audioContext.isPlaying ? <PauseCircleFilled onClick={audioContext.setIsPlaying} /> : <PlayCircleFilled onClick={audioContext.setIsPlaying} />}
      </IconButton>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <FastForward />
      </IconButton>
    </Toolbar>
  )
}

export default withAudioContext(HeaderControls);