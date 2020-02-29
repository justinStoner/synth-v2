import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux'
import { withStyles, Grid } from '@material-ui/core';
import { withRouter, Redirect, Switch, Route } from 'react-router';
import Instrument, { SliderComponents } from '../../components/Instrument';
import { withAudioContext } from '../../context/AudioContext';
import { selectInstruments, selectAudioInstruments } from '../../store/instruments/selectors';
import { updateInstrument, updateEffect } from '../../store/instruments/actions';
import { selectOutput } from '../../store/appReducer';
import PageContainer from '../../components/PageContainer';

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

  getUpdateInstrument = id => (path, newState) => {
    this.props.updateInstrument(id, path, newState);
  }

  updateEffect = (id, path) => (preset, tone, inputNode, outputNode, setTone) => (valueName, setToneEffect) => (event, value) => {
    const val = event && event.target && event.target.value ? event.target.value : value;
    setToneEffect && setToneEffect(tone, val, valueName, preset, inputNode, outputNode, setTone);
    this.props.updateEffect(id, path, valueName, val)
  }

  render() {
    const { classes, match, instruments, audioContext, output, audioInstruments } = this.props;
    console.log(instruments);
    const defaultId = instruments.first().get('id')
    return (
      <Switch>
        <Route sensitive path={`${match.path}/:id`} render={({ match: instrumentMatch }) => {
          const instrumentId = instrumentMatch.params.id
          const instrument = instruments.get(instrumentId) || instruments.get(defaultId);
          const audioInstrument = audioInstruments.get(instrumentId);
          return (
            <Instrument
              instrument={instrument}
              audioInstrument={audioInstrument}
              output={output}
              setEffect={this.updateEffect}
              updateInstrument={this.getUpdateInstrument(instrumentId)}
              render={({ synthComponents, effectComponents, synthControls }) => (
                <PageContainer>
                  <Grid container spacing={1}>
                    <Switch>
                      <Route
                        exact
                        path={`${instrumentMatch.path}/instrument`}
                        render={() => (
                          <>
                            {synthComponents}
                            <Grid item xs={12}>
                              {synthControls}
                            </Grid>
                          </>
                        )}
                      />
                      <Route
                        exact
                        path={`${instrumentMatch.path}/effects`}
                        render={() => (
                          <>
                            {effectComponents}
                            <Grid item xs={12}>
                              {synthControls}
                            </Grid>
                          </>
                        )}
                      />
                      <Redirect to={`${instrumentMatch.path}/instrument`} />
                    </Switch>
                  </Grid>
                </PageContainer>
              )}
            />
          )
        }} />
        <Redirect to={`${match.path}/${defaultId}`}/>
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  instruments: selectInstruments(state),
  audioInstruments: selectAudioInstruments(state),
  output: selectOutput(state),
})

const mapDispatchToProps = dispatch => ({
  updateInstrument: (id, path, payload) => dispatch(updateInstrument(id, path, payload)),
  updateEffect: (id, path, valueName, payload) => dispatch(updateEffect(id, path, valueName, payload)),
})

export default withStyles(styles)(withAudioContext(withRouter(connect(mapStateToProps, mapDispatchToProps)(Synth))));