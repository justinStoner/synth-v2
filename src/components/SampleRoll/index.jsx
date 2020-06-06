import React, { PureComponent } from 'react';
import uuid from 'uuid/v4';
import PT from 'prop-types';
import Tone from 'tone'
import Typography from '@material-ui/core/Typography';
import Timeline from '../../components/Timeline/AltTimeline';
import 'react-calendar-timeline/lib/Timeline.css'
import { withStyles, useTheme } from '@material-ui/core';
import Note from '../PianoRoll/Note';
import { updateClip, addNote } from '../../store/clips/actions';
import { selectBPM, selectBPMe, selectSPB } from '../../store/appReducer';
import { selectTracks } from '../../store/tracks/selectors';
import { selectClips } from '../../store/clips/selectors';
import { connect } from 'react-redux';
import { Clip } from '../../store/clips';
import * as acetone from '../../assets/audio/acetone-rhythm';
import * as casio from '../../assets/audio/casio-sk1';
import * as roland from '../../assets/audio/roland-tr-33';

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
  return (
    <div
      onClick={() => {onContainerClick(group.id)}}
      style={{
        height: '100%',
        textAlign: 'center',
        borderBottom: '1px solid #bdbdbd',
      }}
    >
      <Typography variant="caption" color="inherit" align="center" display="block">
        {group.title}
      </Typography>
    </div>
  )
}
const COL_WIDTH = 75;

class SampleRoll extends PureComponent {

  constructor(props) {
    super(props);
    this.drums = Object.keys({ ...acetone, ...casio, ...roland }).map((drum, index) => ({
      id: index,
      key: drum,
      title: drum,
      name: drum,
    }));
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
      instrumentId: sample.instrumentId,
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

  render() {
    const { classes, sample, BPM, BPMe, SPB } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Timeline
          groups={this.drums}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SampleRoll));