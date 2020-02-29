import React, { PureComponent } from 'react';
import uuid from 'uuid/v4';
import PT from 'prop-types';
import Tone from 'tone'
import Typography from '@material-ui/core/Typography';
import Timeline from '../../components/Timeline/AltTimeline';
import 'react-calendar-timeline/lib/Timeline.css'
import { withStyles, useTheme } from '@material-ui/core';
import Note from './Note';
import { updateClip, addNote } from '../../store/clips/actions';
import { selectBPM, selectBPMe, selectSPB } from '../../store/appReducer';
import { selectTracks } from '../../store/tracks/selectors';
import { selectClips } from '../../store/clips/selectors';
import { connect } from 'react-redux';
import { Clip } from '../../store/clips';

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

  setSelectedTrack = key => {
    this.setState({ selectedTrack: key })
  }

  handleRowClick = (e, rowIndex, group) => {
    const { sample, addNote, SPB } = this.props;
    const stepSize = COL_WIDTH / SPB;
    const stepIndex = Math.floor((e.offsetX + (e.offsetX % stepSize)) / stepSize)
    addNote(sample.key, new Clip({
      id: group.id,
      clipId: sample.key,
      row: group.id,
      key: uuid(),
      title: group.title,
      start: 1 + Math.floor((stepIndex + 1) / SPB),
      end: 1 + Math.floor((stepIndex + 2) / SPB),
      stepStart: Math.floor((stepIndex + 1) % SPB),
      stepEnd: Math.floor((stepIndex + 2) % SPB),
      time: `${Math.floor((stepIndex + 1) / SPB)}:${Math.floor((stepIndex + 1) % SPB)}`,
      endTime: `${Math.floor((stepIndex + 2) / SPB)}:${Math.floor((stepIndex + 2) % SPB)}`,
      duration: Tone.Ticks(Tone.Time(`${Math.floor((stepIndex + 2) / SPB)}:${Math.floor((stepIndex + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((stepIndex + 1) / SPB)}:${Math.floor((stepIndex + 1) % SPB)}`).toTicks()).toNotation(),
    }))
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
    const { classes, sample, BPM, BPMe, SPB } = this.props;
    const { notes } = this.state;
    return (
      <div style={{ height: '100%' }}>
        <Timeline
          groups={notes}
          groupRenderer={GroupRenderer({ onContainerClick: () => {} })}
          groupOffset={115}
          items={(sample && sample.notes.valueSeq()) || []}
          onItemClick={this.handleItemClick}
          onItemDoubleClick={this.handleItemDoubleClick}
          onItemContextClick={this.handleItemContextClick}
          onInteraction={this.handleInteraction}
          onRowClick={this.handleRowClick}
          onRowContextClick={this.handleRowContextClick}
          onRowDoubleClick={this.handleRowDoubleClick}
          BPM={BPM}
          BPMe={BPMe}
          SPB={SPB}
          itemRenderer={Note}
          groupTitleRenderer={undefined}
          rowHeight={15}
          colWidth={75}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  clips: selectClips(state),
  tracks: selectTracks(state),
  BPM: selectBPM(state),
  BPMe: selectBPMe(state),
  SPB: selectSPB(state),
});

const mapDispatchToProps = dispatch => ({
  addNote: (path, payload) => dispatch(addNote(path, payload)),
  updateClip: (key, payload) => dispatch(updateClip(key, payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PianoRoll));