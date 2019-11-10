import React, { PureComponent, useContext } from 'react';
import PT from 'prop-types';
import Tone from 'tone'
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Stop from '@material-ui/icons/Stop';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Typography from '@material-ui/core/Typography';
import Meter from '../../components/Visualizations/Meter';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Timeline from '../../components/Timeline/AltTimeline';
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment';
import { withStyles, useTheme } from '@material-ui/core';
import AudioContext, { withAudioContext, Sample } from '../../context/AudioContext';
import Note from './Note';

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

const GroupRenderer = ({ onContainerClick }) => ({ group }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const audioContext = useContext(AudioContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  const isBlackKey = group.title.includes('#');
  return (
    <div
      onClick={() => {onContainerClick(group)}}
      style={{
        backgroundColor: isBlackKey ? '#dbdbdb' : '#fff',
        borderTop: !isBlackKey && '1px solid #dbdbdb',
      }}
    >
      <Typography component="p" color="inherit" noWrap style={{ fontSize: '0.7rem' }}>
        {group.title}
      </Typography>
    </div>
  )
}

const fromMidi = midi => Tone.Midi(midi).toNote();

const COL_WIDTH = 75;

class PianoRoll extends PureComponent {

  static propTypes = {
    rootOctave: PT.number,
    octaves: PT.number,
    polyphonic: PT.bool,
    noteOn: PT.func,
    noteOff: PT.func,
  }

  static defaultProps = {
    rootOctave: 1,
    octaves: 7,
    polyphonic: 1,
  }

  constructor(props) {
    super(props);
    this.state = { notes: this.getNotes() };
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
    console.log(e);
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

  setSelectedTrack = index => {
    this.setState({ selectedTrack: index })
  }

  handleRowClick = (e, rowIndex, group) => {
    const { sample, audioContext } = this.props;
    const { setSample, SPB } = audioContext
    const stepSize = COL_WIDTH / SPB;
    const stepIndex = Math.floor((e.offsetX + (e.offsetX % stepSize)) / stepSize)
    setSample(sample.index, { notes: sample.notes.push(new Sample({
      id: group.id,
      sampleId: sample.index,
      row: group.id,
      key: group.id + stepIndex,
      title: group.title,
      index: sample.notes.size,
      start: 1 + Math.floor((stepIndex + 1) / SPB),
      end: 1 + Math.floor((stepIndex + 2) / SPB),
      stepStart: Math.floor((stepIndex + 1) % SPB),
      stepEnd: Math.floor((stepIndex + 2) % SPB),
      time: `${Math.floor((stepIndex + 1) / SPB)}:${Math.floor((stepIndex + 1) % SPB)}`,
      endTime: `${Math.floor((stepIndex + 2) / SPB)}:${Math.floor((stepIndex + 2) % SPB)}`,
      duration: Tone.Ticks(Tone.Time(`${Math.floor((stepIndex + 2) / SPB)}:${Math.floor((stepIndex + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((stepIndex + 1) / SPB)}:${Math.floor((stepIndex + 1) % SPB)}`).toTicks()).toNotation(),
    })) })
  };
  zoomIn() {

  }
  zoomOut() {

  }

  toggleCustomRenderers(checked) {

  }

  toggleSelectable() {

  }
  toggleDraggable() {

  }
  toggleResizable() {

  }
  handleItemClick = (e, key) => {

  };

  handleItemDoubleClick = (e, key) => {

  };

  handleItemContextClick = (e, key) => {

  };

  handleRowDoubleClick = (e, rowNumber, clickedTime, snappedClickedTime) => {

  };

  handleRowContextClick = (e, rowNumber, clickedTime, snappedClickedTime) => {

  };

  handleInteraction = (type, changes, items) => {

  };

  getNotes() {
    let notes = []
    for (let i = this.props.rootOctave; i < this.props.rootOctave + this.props.octaves; i++){
      notes = notes.concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => {
        const note = n + (12 * i);
        return ({
          id: note,
          name: note,
          title: fromMidi(note),
        })
      }));
    }
    return notes.reverse();
  }

  render() {
    const { classes, audioContext, sample } = this.props;
    const { notes } = this.state;
    return (
      <div style={{ height: '100%' }}>
        <Timeline
          groups={notes}
          groupRenderer={GroupRenderer({ onContainerClick: () => {} })}
          groupOffset={115}
          items={sample.notes}
          onItemClick={this.handleItemClick}
          onItemDoubleClick={this.handleItemDoubleClick}
          onItemContextClick={this.handleItemContextClick}
          onInteraction={this.handleInteraction}
          onRowClick={this.handleRowClick}
          onRowContextClick={this.handleRowContextClick}
          onRowDoubleClick={this.handleRowDoubleClick}
          BPM={audioContext.BPM}
          BPMe={audioContext.BPMe}
          SPB={audioContext.SPB}
          itemRenderer={Note}
          groupTitleRenderer={undefined}
          rowHeight={15}
          colWidth={75}
        />
      </div>
    )
  }
}

export default withAudioContext(withStyles(styles)(PianoRoll));