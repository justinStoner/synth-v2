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

// const setToneInstrumentValues = (toneInstrument, newValues) => {
//   Object.keys(newValues).forEach(key => {
//     if (!Array.isArray(newValues[key]) && typeof newValues[key] !== 'number' && typeof newValues[key] !== 'string') {
//       Object.keys(newValues[key]).forEach()
//     }
//   })
// }

class Synth extends React.PureComponent {
  static propTypes = {
    polyphonic: PT.bool,
  }
  static defaultProps = {
    polyphonic: false,
  }

  render() {
    const { classes, match, audioContext } = this.props;
    const defaultId = audioContext.instruments.first().get('id')
    return (
      <Switch>
        <Route path={`${match.path}/:id`} render={({ match: instrumentMatch }) => {
          console.log(instrumentMatch)
          const instrument = audioContext.instruments.get(instrumentMatch.params.id) || audioContext.instruments.get(defaultId);
          return (
            <Instrument path={instrumentMatch.path}
              audioNode={instrument}
              output={audioContext.output}
              setInstrument={audioContext.setInstrument}
              setEffect={audioContext.setEffect}
            />
          )
        }} />
        <Redirect to={`${match.path}/${defaultId}`}/>
      </Switch>
    )
  }
}

export default withStyles(styles)(withAudioContext(withRouter(Synth)));