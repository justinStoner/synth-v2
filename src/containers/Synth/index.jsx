import React from 'react';
import PT from 'prop-types';
import Tone from 'tone';
import { withStyles } from '@material-ui/core';
import { withRouter, Redirect, Switch, Route } from 'react-router';
import Instrument from '../../components/Instrument';
import presets, { tonePresets } from './presets';
import { withAudioContext } from '../../context/AudioContext';

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
    padding: theme.spacing(0.5),
  },
});

class Synth extends React.PureComponent {
  static propTypes = {
    polyphonic: PT.bool,
  }
  static defaultProps = {
    polyphonic: false,
  }

  getUpdateInstrument = instrumentName => (path, newState) => {
    this.props.audioContext.updateInstrument(instrumentName, path, newState);
  }

  render() {
    const { classes, match, audioContext } = this.props;
    const defaultId = audioContext.instruments.first().get('id')
    return (
      <Switch>
        <Route sensitive path={`${match.path}/:id`} render={({ match: instrumentMatch }) => {
          const instrumentId = instrumentMatch.params.id
          const instrument = audioContext.instruments.get(instrumentId) || audioContext.instruments.get(defaultId);
          const preset = instrument.get('preset');
          return (
            <Instrument
              path={instrumentMatch.path}
              instrument={instrument}
              output={audioContext.output}
              setEffect={audioContext.setEffect}
              updateInstrument={this.getUpdateInstrument(instrumentId)}
            />
          )
        }} />
        <Redirect to={`${match.path}/${defaultId}`}/>
      </Switch>
    )
  }
}

export default withStyles(styles)(withAudioContext(withRouter(Synth)));