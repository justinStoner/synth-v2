import React from 'react';
import PT from 'prop-types';
import { withStyles } from '@material-ui/core';
import Note from './Note';

const styles = theme => ({
  container: {
    display: 'block',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  note: {
    order: 0,
    flexGrow: 1,
    padding: theme.spacing(0.25),
  },
  whiteNotes: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  blackNotes: {
    position: 'absolute',
    top: '0px',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: '55%',
  },
  // #black-notes tone-keyboard-note:first-child, #black-notes tone-keyboard-note:last-child {
  //   flex-grow: 0.5;
  //   pointer-events: none;
  // }
});

class Octave extends React.Component {
  static propTypes = {
    octave: PT.bool,
  }
  static defaultProps = {
    octave: 1,
  }
  noteon = number => {
    const note = this.shadowRoot.querySelector(`tone-keyboard-note[note="${number}"]`)
    note.active = true
  }

  noteoff = number => {
    const note = this.shadowRoot.querySelector(`tone-keyboard-note[note="${number}"]`)
    note.active = false
  }

  getNoteByTouchId = id => {
    const element = Array.from(this.shadowRoot.querySelectorAll('tone-keyboard-note')).find(e => e.touchid === id)
    if (element && element.note){
      return element
    }
  }

  render(){
    const { octave, classes } = this.props;
    const startNote = 12 * octave
    const whiteNotes = [0, 2, 4, 5, 7, 9, 11].map(i => i + startNote)
    const blackNotes = [0, 1, 3, 0, 6, 8, 10, 0].map(i => i ? i + startNote : 0)
    return(
      <div className={classes.container}>
        <div className={classes.whiteNotes}>
          {whiteNotes.map(note => <div key={note} className={classes.note}><Note isWhite key={note} note={note} /></div>)}
        </div>
        <div className={classes.blackNotes}>
          {blackNotes.map(note => <div key={note} className={classes.note}><Note key={note} note={note} /></div>)}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Octave);