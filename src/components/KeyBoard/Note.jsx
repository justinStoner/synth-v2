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
  },
  grey: {
    backgroundColor: grey[500],
    color: 'white',
    textAlign: 'center',
  },
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
    active: false,
    touchid: -1,
  }

  setActive = active => {
    this.setState({ active, touchid: active? this.state.touchid : -1 });
    const { note } = this.props;
    const eventName = active ? 'noteon' : 'noteoff'
    // this.dispatchEvent(new CustomEvent(eventName, {
    //   detail : {
    //     name : this.fromMidi(note),
    //     midi : note,
    //     velocity : active ? 1 : 0,
    //   },
    //   composed : true,
    //   bubbles : true,
    // }));
  }

  mouseover = e => {
    if (e.buttons){
      this.setActive(true)
      this.shadowRoot.querySelector('button').focus()
    }
  }

  keydown = e => {
    resume(e)
    if (!e.repeat && (e.key === ' ' || e.key === 'Enter')){
      this.setActive(true)
    }
  }

  keyup = e => {
    if (e.key === ' ' || e.key === 'Enter'){
      this.setActive(false)
    }
  }

  touchstart = e => {
    e.preventDefault()
    this.touchid = e.touches[0].identifier
    this.setActive(true)
  }

  render(){
    const { classes, note, isWhite } = this.props;
    const { active } = this.state;
    const show = note !== 0
    return (
      <div className={classes.container}>
        {show && <Paper
          className={clsx(classes.paper, isWhite ? classes.white : classes.grey)}
          onMouseOver={this.mouseover}
          onMouseLeave={() => this.setActive(false)}
          onMouseDown={() => this.setActive(true)}
          onTouchStart={this.touchstart}
          onTouchEnd={() => this.setActive(false)}
          onMouseUp={() => this.setActive(false)}
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