import React from 'react';
import PT from 'prop-types';
import Tone from 'tone';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import { resume } from '../../utils/resume';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';

const styles = theme => ({
  host: {
    display: 'block',
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  button: {
    border: 'none',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    padding: 0,
    outline: 'none',
    transition: 'background-color 0.2s',
    color: 'transparent',
    fontSize: '0px',
    borderRadius: '2px',
  },
  paper: {
    width: '100%',
    height: '100%',
  },
  white: {
    textAlign: 'center',
    paddingTop: '100%',
    border: `2px solid ${theme.palette.text.disabled}`,
    '&$isActive': {
      backgroundColor: theme.palette.primary['A200'],
      color: 'white',
      border: '2px solid transparent',
    },
    '&$hover': {
      border: '2px solid transparent',
      backgroundColor: theme.palette.primary['A200'],
      color: 'white',
    },
  },
  grey: {
    backgroundColor: grey[500],
    color: 'white',
    textAlign: 'center',
    '&$isActive': {
      backgroundColor: theme.palette.secondary['A100'],
      color: 'white',
    },
    '&$hover': {
      backgroundColor: theme.palette.secondary['A100'],
      color: 'white',
    },
  },
  isActive: {},
  hover: {},
})

class Note extends React.Component {

  static propTypes = {
    note: PT.number,
    velocity: PT.number,
  }

  static defaultProps = {
    note: PT.number,
    velocity: PT.number,
  }

  fromMidi(midi){
    return Tone.Midi(midi).toNote()
  }

  constructor(props){
    super(props)
    this.activecolor = 'white'
  }

  state = {
    hover: false,
    touchid: -1,
  }

  setActive = () => {
    this.props.setActiveNote(this.props.note)
  }

  mouseover = e => {
    this.setState({ hover: true })
  }

  mouseleave = e => {
    this.setState({ hover: false })
  }

  keydown = e => {
    resume(e)
    if (!e.repeat && (e.key === ' ' || e.key === 'Enter')){
      this.setActive(this.props.note)
    }
  }

  keyup = e => {
    if (e.key === ' ' || e.key === 'Enter'){
      this.setActive(this.props.note)
    }
  }

  touchstart = e => {
    e.preventDefault()
    this.touchid = e.touches[0].identifier
    this.setActive(this.props.note)
  }

  render(){
    const { classes, note, isWhite, isActive, setActiveNote } = this.props;
    const { hover } = this.state;
    const show = note > 0
    return (
      <div className={classes.container}>
        {show && <Paper
          className={clsx(classes.paper, isWhite ? classes.white : classes.grey, isActive && classes.isActive, (!isActive && hover) && classes.hover)}
          onMouseOver={this.mouseover}
          onMouseLeave={this.mouseleave}
          onMouseDown={() => this.setActive(note)}
          onTouchStart={this.touchstart}
          onTouchEnd={() => this.setActive(note)}
          onMouseUp={() => this.setActive(note)}
          onKeyDown={this.keydown}
          onKeyUp={this.keyup}
          elevation={0}
        >
          {this.fromMidi(note).replace('#', '♯')}
        </Paper>}
      </div>
    );
  }

}

export default withStyles(styles)(Note);