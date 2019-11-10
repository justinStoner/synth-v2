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

  getNoteByTouchId = id => {

  }

  render(){
    const { octave, classes, activeNotes, noteOn, noteOff, setActiveNote } = this.props;
    const startNote = 12 * octave
    const whiteNotes = [0, 2, 4, 5, 7, 9, 11].map(i => i + startNote)
    const blackNotes = [0, 1, 3, -1, 6, 8, 10, -2].map(i => i > 0 ? i + startNote : i)
    return(
      <div className={classes.container}>
        <div className={classes.whiteNotes}>
          {whiteNotes.map(note => <div key={note} className={classes.note}><Note setActiveNote={setActiveNote} isWhite isActive={activeNotes[note]} noteOn={noteOn} noteOff={noteOff} note={note} /></div>)}
        </div>
        <div className={classes.blackNotes}>
          {blackNotes.map(note => <div key={note} className={classes.note}><Note setActiveNote={setActiveNote} isActive={activeNotes[note]} noteOn={noteOn} noteOff={noteOff} note={note} /></div>)}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Octave);