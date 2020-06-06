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
    polyphonic: 1,
  }
  constructor(props) {
    super(props);
    this.state = {
      octaves: this.setOctaves(),
      activeNotes: {},
      totalPlaying: 0,
    }
    this.computerKeyboard = new AudioKeys({ polyphonic: props.polyphonic });
    this.computerKeyboard.down(e => {
      resume()
      this.noteOn(Object.assign({}, e, { midi: e.note }));
    });
    this.computerKeyboard.up(e => {
      this.noteOff(Object.assign({}, e, { midi: e.note }));
    })
  }

  componentWillUnmount() {
    this.computerKeyboard._listeners = {};
    delete this.computerKeyboard;
  }

  setOctaves() {
    const octaves = []
    for (let i = this.props.rootOctave; i < this.props.rootOctave + this.props.octaves; i++){
      octaves.push(i)
    }

    return octaves;
  }

  setActiveNote = note => {
    const { activeNotes, totalPlaying } = this.state;
    this.setState({ totalPlaying: activeNotes[note] ? totalPlaying - 1 : totalPlaying  + 1, activeNotes: Object.assign({}, activeNotes, { [note]: activeNotes[note] ? undefined : true }) })
  }

  noteOn = e => {
    const name = fromMidi(e.midi);
    this.setActiveNote(e.note)
    this.props.noteOn(Object.assign({}, e, { name, totalPlaying: this.state.totalPlaying }))
  }

  noteOff = e => {
    this.setActiveNote(e.note)
    this.props.noteOff(Object.assign({}, e, { name: fromMidi(e.midi), totalPlaying: this.state.totalPlaying }));
  }

  render(){
    const { octaves, activeNotes } = this.state;
    const { classes } = this.props;
    return(
      <div className={classes.container}
        onTouchMove={this.touchmove}
        onTouchEnd={this.touchend}>
        {octaves.map(o => <div key={o} className={classes.octaveContainer}>
          <Octave octave={o} setActiveNote={this.setActiveNote} activeNotes={activeNotes} noteOn={this.noteOn} noteOff={this.noteOff} />
        </div>)}
      </div>
    );
  }
}

export default withStyles(styles)(KeyBoard);