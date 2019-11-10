import React, { PureComponent, useContext } from 'react';
import Tone from 'tone';
import IconButton from '@material-ui/core/IconButton';
import { List } from 'immutable'
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
import KeyBoard from '../../components/KeyBoard/KeyBoard';
import Recorder from './Recorder'
import Track from './Track'
import PianoRoll from '../../components/PianoRoll';
import AudioContext, { withAudioContext, Sample } from '../../context/AudioContext';
import './styles.css';
import Clip from './Clip';

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

const items = [
  {
    id: 0,
    row: 0,
    key: 0,
    title: 'item 1',
    start: 1,
    end: 4,
    color: '#2196f3',
  },
  {
    id: 1,
    row: 1,
    key: 1,
    title: 'item 2',
    start: 3,
    end: 5,
  },
  {
    id: 2,
    row: 2,
    key: 2,
    title: 'item 3',
    start: 2,
    end: 7,
  },
]

const GroupRenderer = ({ onContainerClick, selectedTrack }) => ({ group }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const audioContext = useContext(AudioContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme();
  const isSelected = group.id === selectedTrack;
  return (
    <div
      onClick={() => {onContainerClick(group.id)}}
      style={{
        backgroundColor: isSelected ? '#dbdbdb' : '#fff',
      }}
    >
      <Typography component="p" color="inherit" noWrap>
        {group.title}
      </Typography>
      <div>
        <Recorder
          stream={audioContext.instruments.getIn([group.name, 'channelOut'])}
          onDataAvailable={e => this.chunks.push(e.data)}
          onStop={e => {
            const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
            this.waveSurfer.loadBlob(new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' }))
          //audioContext.setTrackData(index, 'audioData', blob);
          }}
          render={({ state, start, stop, pause, resume }) => (
          <>
            {
              state !== 'recording' ?
                (<IconButton size="small" onClick={() => {audioContext.setSelectedInstrument(group.title);start()}}>
                  <FiberManualRecord color='secondary' />
                </IconButton>)
                : (
                  (<IconButton size="small" onClick={() => {stop()}}>
                    <Stop color='secondary' />
                  </IconButton>)
                )
            }
          </>
          )}
        />
        <IconButton size="small">
          {
            !group.mute ? <VolumeOff /> : <VolumeUp />
          }
        </IconButton>
      </div>
    </div>
  )
}

const COL_WIDTH = 55;

class Recording extends PureComponent {
  constructor(props) {
    super(props);
    const data = [];
    this.state = {
      data, blob: new Blob(data),
      selectedTrack: 0,
      selectedSample: 0,
    };
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
    console.log(e)
    audioNode.triggerRelease(e.name);
  }

  setSelectedTrack = index => {
    this.setState({ selectedTrack: index })
  }

  handleRowClick = (e, rowIndex, group) => {
    console.log(e.target, rowIndex, group);
    if (e.target.getAttribute('data-row-index') == rowIndex) {
      const { audioContext } = this.props;
      const { addSample, SPB } = audioContext
      const stepSize = COL_WIDTH / SPB;
      const stepIndex = Math.floor((e.offsetX + (e.offsetX % stepSize)) / stepSize)
      addSample(new Sample({
        id: group.id,
        row: group.id,
        key: group.id + audioContext.samples.size,
        title: group.title,
        instrument: group.name,
        notes: new List(),
        index: audioContext.samples.size,
        start: 1 + Math.floor((stepIndex + 1) / SPB),
        end: 1 + Math.floor((stepIndex + 2) / SPB),
        stepStart: Math.floor((stepIndex + 1) % SPB),
        stepEnd: Math.floor((stepIndex + 2) % SPB),
        time: `${Math.floor((stepIndex + 1) / SPB)}:${Math.floor((stepIndex + 1) % SPB)}`,
        endTime: `${Math.floor((stepIndex + 2) / SPB)}:${Math.floor((stepIndex + 2) % SPB)}`,
        duration: Tone.Ticks(Tone.Time(`${Math.floor((stepIndex + 2) / SPB)}:${Math.floor((stepIndex + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((stepIndex + 1) / SPB)}:${Math.floor((stepIndex + 1) % SPB)}`).toTicks()).toNotation(),
      }));
      this.setState({ selectedSample: audioContext.samples.size })
    }
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
  handleItemClick = (e, item, rowIndex) => {
    console.log(e, item, rowIndex)
    console.log(item.toJS());
    this.setState({ selectedSample: item.index })

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

  render() {
    const { classes, audioContext } = this.props;
    const { selectedTrack, selectedSample } = this.state;
    const instrument = this.getSelectedInstrument()
    return (
      <div style={{ height: 'calc(100% - 90px)' }}>
        <div style={{ height: '60%' }}>
          <Timeline
            startDate={moment('2018-08-31')}
            endDate={moment('2018-9-30')}
            groups={audioContext.tracks.toJS()}
            groupRenderer={GroupRenderer({ onContainerClick: this.setSelectedTrack, selectedTrack })}
            groupOffset={115}
            items={audioContext.samples}
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
            itemRenderer={Clip}
            groupTitleRenderer={undefined}
          />
        </div>
        <div style={{ height: '40%' }}>
          <PianoRoll
            sample={audioContext.samples.getIn([selectedSample])}
          />
        </div>
      </div>
    )
  }
}

export default withAudioContext(withStyles(styles)(Recording));