import React from 'react';
import PT from 'prop-types';
import Tone from 'tone';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';
import { Route, Switch, Redirect } from 'react-router-dom';
import Envelope from '../../components/AudioNodes/Envelope';
import Oscillator from '../../components/AudioNodes/Oscillator';
import PageContainer from '../PageContainer';
import InstrumentContext from '../../context/InstrumentContext';
import KeyBoard from '../KeyBoard/KeyBoard';
import { instrumentPresets } from '../../containers/Synth/presets';
import EffectChain from '../EffectChain';
import Visualization from './Visualization';
import { SliderWithLabel } from '../Slider';
import routes from '../../routes';
import BaseCard from '../AudioNodes/BaseCard';
import Filter from '../AudioNodes/Filter';
import Lfo from '../AudioNodes/Lfo';

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

class Instrument extends React.PureComponent {
  static propTypes = {
    polyphonic: PT.bool,
    instrument: PT.string.isRequired,
    output: PT.object.isRequired,
  }
  static defaultProps = {
    polyphonic: false,
  }

  constructor(props) {
    super(props);
    this.state={
      instrument: props.audioNode.get('preset'),
      audioNode: props.audioNode,
      node: props.audioNode.get('node'),
      setInstrument: this.setInstrument,
    }
  }

  componentWillUnmount() {
    this.props.setInstrument(this.state.audioNode.get('name'), this.state.instrument)
  }

  setInstrument = newState => {
    this.setState((state, props) => {
      console.log(newState);
      const preset = Object.assign({}, state.instrument.preset, newState);
      const instrument = Object.assign({}, state.instrument, { preset });
      console.log(instrument);
      return { instrument }
    });
  }

  noteOn = e => {
    this.state.node.triggerAttack(e.name, undefined, e.velocity);
  }
  noteOff = e => {
    this.state.node.triggerRelease(e.name);
  }
  render() {
    const { classes, children, path, audioNode, setEffect } = this.props;
    const { instrument, node } = this.state;
    const instrumentId = audioNode.get('id');
    const filter = audioNode.get('filter');
    const lfo = audioNode.get('lfo');
    const lfo1 = audioNode.get('lfo1');
    console.log(lfo);
    return (
      <InstrumentContext.Provider value={this.state}>
        <PageContainer>
          <Grid container spacing={1}>
            <Switch>
              <Route
                exact
                path={`${path}/instrument`}
                render={() => (
                  <>
                    <Envelope label="Carrier Envelope" name="envelope" />
                    <Oscillator label="Carrier Oscillator" name="oscillator" />
                    <Envelope label="Modulation Envelope" name="modulationEnvelope" />
                    <Oscillator label="Modulation Oscillator" name="modulation" />
                    <Lfo label="Lfo (Cutoff)" name="lfo" preset={lfo.get('preset')} setValue={setEffect(instrumentId, 'lfo')(lfo.get('preset'), lfo.get('tone'))} />
                    <Lfo label="Lfo (Q)" name="lfo" preset={lfo1.get('preset')} setValue={setEffect(instrumentId, 'lfo1')(lfo1.get('preset'), lfo1.get('tone'))} />
                    <BaseCard label="Filter">
                      <Filter preset={filter.get('preset')} tone={filter.get('tone')} setEffect={setEffect(instrumentId, 'filter')(filter.get('preset'), filter.get('tone'))} />
                    </BaseCard>
                  </>
                )}
              />
              <Route exact path={`${path}/effects`} render={() => (
                <EffectChain instrumentId={instrumentId} inputNode={node} outputNode={this.props.output} />
              )} />
              <Redirect to={`${path}/instrument`} />
            </Switch>
            <Grid item xs={12}>
              <Paper className={clsx(classes.paper, classes.keyboardContainer)}>
                <div>
                  <Visualization source={this.props.output} />
                </div>
                <SliderWithLabel onChange={(e, value) => {this.setInstrument({ portamento: value });node.portamento = value;}} min={0} max={0.3} step={0.01} label="Portamento" value={instrument.preset.portamento} />
                <KeyBoard polyphonic={instrument.polyphonic} noteOff={this.noteOff} noteOn={this.noteOn} />
              </Paper>
            </Grid>
          </Grid>
        </PageContainer>
      </InstrumentContext.Provider>
    )
  }
}

export default withStyles(styles)(Instrument);