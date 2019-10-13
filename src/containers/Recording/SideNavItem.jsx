import React from 'react';
import { withStyles } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import Stop from '@material-ui/icons/Stop';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import { withAudioContext } from '../../context/AudioContext';
import { instrumentNames } from '../Synth/presets';
import Meter from '../../components/Visualizations/Meter';
import Recorder from './Recorder';

const styles = theme => ({
  dense: {
    fontSize: '0.875rem',
  },
})

class SideNavItem extends React.PureComponent {

  chunks = [];

  render() {
    const { audioContext, classes } = this.props;
    return (
      <>
        {
          audioContext.tracks.valueSeq().map((track, i) => (
            <ListItem key={track.name} selected={audioContext.selectedInstrument === track.name} inset dense>
              <ListItemIcon>
                <Meter style={{ padding: '0px 6px' }} barWidth={9} input={track.name} height={14} width={14} />
              </ListItemIcon>
              <ListItemText dense className={classes.dense} secondary={track.displayName} onClick={() => {audioContext.setSelectedInstrument(track.name)}} />
              <div>
                <Recorder
                  stream={this.props.audioContext.instruments.getIn([this.props.audioContext.selectedInstrument, 'channelOut'])}
                  onDataAvailable={e => this.chunks.push(e.data)}
                  onStop={e => {
                    const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
                    audioContext.setTrackData(i, 'audioData', blob);
                  }}
                  render={({ state, start, stop, pause, resume }) => (
                    <div>
                      {
                        state !== 'recording' ?
                          (<IconButton size="small" onClick={() => {start()}}>
                            <FiberManualRecord color='secondary' />
                          </IconButton>)
                          : (
                            (<IconButton size="small" onClick={() => {stop()}}>
                              <Stop color='secondary' />
                            </IconButton>)
                          )
                      }
                      {state}
                    </div>
                  )}
                />
                <IconButton size="small">
                  {
                    !track.mute ? <VolumeOff /> : <VolumeUp />
                  }
                </IconButton>
              </div>
            </ListItem>
          ))
        }
      </>
    )
  }
}

export default withStyles(styles)(withAudioContext(SideNavItem))