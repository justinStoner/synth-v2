import React, { PureComponent, useContext } from 'react';
import uuid from 'uuid/v4';
import Tone from 'tone';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { Map } from 'immutable'
import { connect } from 'react-redux';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Stop from '@material-ui/icons/Stop';
import VolumeOff from '@material-ui/icons/VolumeOff';
import Tooltip from '@material-ui/core/Tooltip';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'
import Meter from '../../components/Visualizations/Meter';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Timeline from '../../components/Timeline/AltTimeline';
import { withStyles, useTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import PianoRoll from '../../components/PianoRoll';
import './styles.css';
import Clip from './Clip';
import { updateInstrument, updateEffect } from '../../store/instruments/actions';
import { Clip as ClipRecord } from '../../store/clips'
import { selectClips } from '../../store/clips/selectors';
import { selectTracks } from '../../store/tracks/selectors';
import { selectBPM, selectBPMe, selectSPB } from '../../store/appReducer';
import { addClip } from '../../store/clips/actions';
import { instrumentNames } from '../Synth/presets';
import { addTrack, setChannelVolume } from '../../store/tracks/actions';
import { SliderWithLabel } from '../../components/Slider';
import Instrument from '../../components/Instrument';
import { selectInstruments, selectAudioInstruments } from '../../store/instruments/selectors';
import RecordingContext from '../../context/RecordingContext';

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

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

// eslint-disable-next-line react/display-name
const GroupRenderer = ({ onContainerClick, onChange, audioInstruments }) => ({ group }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const{ selectedTrack } = useContext(RecordingContext);
  const isSelected = group.id === selectedTrack;
  return (
    <div
      onClick={() => {onContainerClick(group.id)}}
      style={{
        backgroundColor: isSelected ? '#dbdbdb' : '#fff',
        height: '100%',
        textAlign: 'center',
        borderBottom: '1px solid #bdbdbd',
      }}
    >
      <Typography variant="caption" color="inherit" align="center" display="block">
        {group.title} {group.id + 1}
      </Typography>
      <LightTooltip
        interactive
        style={{ maxWidth: 'none' }}
        title={
          <SliderWithLabel
            onChange={(e, value) => onChange(group.id, group.instrumentId, (value || e && e.target && e.target.value))}
            value={group.volume}
            min={-40}
            max={40}
          />
        }
      >
        <IconButton size="small">
          <VolumeUp fontSize="small"/>
        </IconButton>
      </LightTooltip>
      <IconButton size="small" disabled>
        <Meter style={{ position: 'relative', top: 1 }} height={14} width={14} barWidth={9} input={group.instrumentId} />
      </IconButton>
      <div>
        {/* <Recorder
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
        /> */}
        {/* <IconButton size="small">
          {
            !group.mute ? <VolumeOff /> : <VolumeUp />
          }
        </IconButton> */}
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
      selectedSample: null,
      tab: 1,
    };
  }

  setSelectedTrack = index => {
    this.setState({ selectedTrack: index })
  }

  handleRowClick = (e, rowIndex, group) => {
    console.log(e.target, rowIndex, group);
    if (e.target.getAttribute('data-row-index') == rowIndex) {
      const { clips, SPB, addClip } = this.props;
      const stepSize = COL_WIDTH / SPB;
      const stepIndex = Math.floor((e.offsetX + (e.offsetX % stepSize)) / stepSize)
      const newClip = new ClipRecord({
        id: group.id,
        trackId: group.id,
        row: group.id,
        key: uuid(),
        title: group.title,
        notes: new Map(),
        index: clips.size,
        start: 1 + Math.floor((stepIndex + 1) / SPB),
        end: 1 + Math.floor((stepIndex + 2) / SPB),
        stepStart: Math.floor((stepIndex + 1) % SPB),
        stepEnd: Math.floor((stepIndex + 2) % SPB),
        time: `${Math.floor((stepIndex + 1) / SPB)}:${Math.floor((stepIndex + 1) % SPB)}`,
        endTime: `${Math.floor((stepIndex + 2) / SPB)}:${Math.floor((stepIndex + 2) % SPB)}`,
        duration: Tone.Ticks(Tone.Time(`${Math.floor((stepIndex + 2) / SPB)}:${Math.floor((stepIndex + 2) % SPB)}`).toTicks() - Tone.Time(`${Math.floor((stepIndex + 1) / SPB)}:${Math.floor((stepIndex + 1) % SPB)}`).toTicks()).toNotation(),
      })
      addClip(newClip);
      this.setState({ selectedSample: newClip.key })
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
    this.setState({ selectedSample: item.key })

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

  getUpdateInstrument = id => (path, newState) => {
    this.props.updateInstrument(id, path, newState);
  }

  updateEffect = (id, path) => (preset, tone, inputNode, outputNode, setTone) => (valueName, setToneEffect) => (event, value) => {
    const val = event && event.target && event.target.value ? event.target.value : value;
    setToneEffect && setToneEffect(tone, val, valueName, preset, inputNode, outputNode, setTone);
    this.props.updateEffect(id, path, valueName, val)
  }

  render() {
    const { classes, clips, tracks, BPM, BPMe, SPB, addTrack, setChannelVolume, instruments, audioInstruments } = this.props;
    const { selectedTrack, selectedSample, menuAnchor } = this.state;
    const instrumentId = tracks.getIn([selectedTrack, 'instrumentId']);
    return (
      <RecordingContext.Provider value={this.state}>
        <div style={{ height: 'calc(100% - 90px)' }}>
          <div style={{ height: '40%' }}>
            <Menu
              id="simple-menu"
              anchorEl={menuAnchor}
              keepMounted
              open={Boolean(menuAnchor)}
              onClose={() => {this.setState({ menuAnchor: null })}}
            >
              {
                instrumentNames.map(item => (
                  <MenuItem
                    key={item.value}
                    onClick={() => {addTrack(item)}}
                  >
                    {item.label}
                  </MenuItem>
                ))
              }
            </Menu>
            <Timeline
              groups={tracks.toJS()}
              groupRenderer={GroupRenderer({ onContainerClick: this.setSelectedTrack, selectedTrack, onChange: setChannelVolume, audioInstruments })}
              groupOffset={115}
              items={clips.valueSeq()}
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
              itemRenderer={Clip}
              groupTitleRenderer={undefined}
              upperLeftComponent={(
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <IconButton size="small" color="primary" onClick={e => this.setState({ menuAnchor: e.currentTarget })}>
                    <AddIcon style={{ fontSize: '0.6rem' }} />
                    <span style={{ fontSize: '0.6rem' }}>add track</span>
                  </IconButton>
                </div>
              )}
            />
          </div>
          <div style={{ height: '60%' }}>
            <Paper style={{ marginBottom: '8px' }}>
              <Tabs
                value={this.state.tab}
                onChange={(e, newValue) => this.setState({ tab: newValue })}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Piano roll"/>
                <Tab label="Instrument settings"/>
                <Tab label="Effect settings"/>
              </Tabs>
            </Paper>
            {this.state.tab === 0 &&<PianoRoll
              sample={clips.getIn([selectedSample])}
            />}
            {this.state.tab === 1 && (
              <Grid container spacing={1}>
                <Instrument
                  render={({ synthComponents }) => <>{synthComponents}</>}
                  size="xs"
                  setEffect={this.updateEffect}
                  updateInstrument={this.getUpdateInstrument(instrumentId)}
                  instrument={instruments.get(instrumentId)}
                  audioInstrument={audioInstruments.get(instrumentId)}
                />
              </Grid>
            )}
            {this.state.tab === 2 && (
              <Grid container spacing={1}>
                <Instrument
                  render={({ effectComponents }) => <>{effectComponents}</>}
                  setEffect={this.updateEffect}
                  updateInstrument={this.getUpdateInstrument(instrumentId)}
                  instrument={instruments.get(instrumentId)}
                  audioInstrument={audioInstruments.get(instrumentId)}
                />
              </Grid>
            )}
          </div>
        </div>
      </RecordingContext.Provider>
    )
  }
}

const mapStateToProps = state => ({
  clips: selectClips(state),
  tracks: selectTracks(state),
  BPM: selectBPM(state),
  BPMe: selectBPMe(state),
  SPB: selectSPB(state),
  instruments: selectInstruments(state),
  audioInstruments: selectAudioInstruments(state),
});

const mapDispatchToProps = dispatch => ({
  addClip: payload => dispatch(addClip(payload)),
  addTrack: payload => dispatch(addTrack(payload)),
  updateInstrument: (id, path, payload) => dispatch(updateInstrument(id, path, payload)),
  updateEffect: (id, path, valueName, payload) => dispatch(updateEffect(id, path, valueName, payload)),
  setChannelVolume: (key, instrumentId, volume) => dispatch(setChannelVolume(key, instrumentId, volume)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Recording));