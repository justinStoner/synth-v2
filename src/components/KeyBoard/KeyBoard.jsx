import React from 'react';
import PT from 'prop-types';
import Tone from 'tone';
import AudioKeys from 'audiokeys';
import { resume } from '../../utils/resume';
import { withStyles } from '@material-ui/core';
import Octave from './Octave';

const styles = theme => ({
  container: {
    display: 'flex',
    height: '80px',
  },
  octaveContainer: {
    flexGrow: '1',
  },
})

const fromMidi = midi => Tone.Midi(midi).toNote();

class KeyBoard extends React.PureComponent {
  static propTypes = {
    rootOctave: PT.number,
    octaves: PT.number,
    polyphonic: PT.bool,
    noteOn: PT.func,
    noteOff: PT.func,
  }

  static defaultProps = {
    rootOctave: 3,
    octaves: 4,
    polyphonic: false,
  }
  constructor (props) {
    super(props);
    this.computerKeyboard = new AudioKeys({ polyphonic: props.polyphonic });
    this.computerKeyboard.down(e => {
      resume()
      this.noteon(Object.assign({}, e, { midi: e.note }));
    });
    this.computerKeyboard.up(e => {
      this.noteoff(Object.assign({}, e, { midi: e.note }));
    })
  }

  getNoteByTouchId = id => {
    // const octave = Array.from(this.shadowRoot.querySelectorAll('tone-keyboard-octave')).find(o => o._getNoteByTouchId(id))
    // if (octave){
    //   return octave._getNoteByTouchId(id)
    // }
  }

  touchmove = event => {
    // Array.from(event.changedTouches).forEach(e => {
    //   const activeNote = this._getNoteByTouchId(e.identifier)
    //   const element = this.shadowRoot.elementFromPoint(e.clientX, e.clientY)
    //   if (element && element.shadowRoot){
    //     const note = element.shadowRoot.elementFromPoint(e.clientX, e.clientY)
    //     if (note && note.note && activeNote.note !== note.note){
    //       activeNote.active = false
    //       activeNote.touchid = -1
    //       note.active = true
    //       note.touchid = e.identifier
    //     }
    //   }
    // })
  }

  touchend = event => {
    // Array.from(event.changedTouches).forEach(e => {
    //   this.getNoteByTouchId(e.identifier)
    //   const activeNote = this.getNoteByTouchId(e.identifier)
    //   if (activeNote && activeNote.active){
    //     activeNote.active = false
    //     activeNote.touchid = -1
    //   }
    // })
  }

  noteon(e){
    const octaveNumber = Math.floor(e.midi / 12);
    this.props.noteOn(Object.assign({}, e, { name: fromMidi(e.midi) }))
  }

  noteoff(e){
    const octaveNumber = Math.floor(e.midi / 12);
    this.props.noteOff(Object.assign({}, e, { name: fromMidi(e.midi) }));
  }

  render(){
    const octaves = []
    const { rootOctave, classes } = this.props;
    for (let i = rootOctave; i < rootOctave + this.props.octaves; i++){
      octaves.push(i)
    }
    return(
      <div className={classes.container}
        onTouchMove={this.touchmove}
        onTouchEnd={this.touchend}>
        {octaves.map(o => <div key={o} className={classes.octaveContainer}><Octave octave={o} /></div>)}
      </div>
    );
  }
}

export default withStyles(styles)(KeyBoard);