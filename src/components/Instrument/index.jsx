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

const SynthComponents = React.memo(({ synthComponents }) => (
  <>
    {synthComponents && synthComponents.valueSeq().map((props, index) => props.component === 'envelope' ? <Envelope {...props} key={props.name + index} /> : <Oscillator {...props} key={props.name + index} />)}
  </>
));
SynthComponents.displayName = 'SynthComponents';

const SliderComponents = React.memo(({ updateInstrument, instrument }) => {
  const sliderComponents = instrument.get('sliderComponents');
  return (
    <>
      {sliderComponents.valueSeq().map((props, index) => (
        <Grid key={props.name + index} item xs={props.size || 12 / sliderComponents.size}>
          <SliderWithLabel
            onChange={(e, value) => {
              const newVal = { [props.name]: value };
              updateInstrument(props.parent ? ['preset', props.parent] : ['preset'], newVal);
              instrument.get('audioNode').set(props.parent ? { [props.parent]: newVal } : newVal);
            }}
            min={props.min}
            max={props.max}
            step={props.step}
            label={props.label}
            value={instrument.getIn(props.parent ? ['preset', props.parent, props.name] : ['preset', props.name])}
          />
        </Grid>
      ))}
    </>
  )
});
SliderComponents.displayName = 'SliderComponents';

class Instrument extends React.PureComponent {
  static propTypes = {
    instrument: PT.string.isRequired,
    output: PT.object.isRequired,
  }

  noteOn = e => {
    const audioNode = this.props.instrument.get('audioNode');
    const attack = audioNode.get('envelope').attakc;
    if (e.totalPlaying === 1) {
      this.props.instrument.getIn(['lfo', 'tone']).start();
      this.props.instrument.getIn(['lfo1', 'tone']).start();
      this.props.instrument.getIn(['lfoGain']).gain.linearRampToValueAtTime(1, attack);
      this.props.instrument.getIn(['lfo1Gain']).gain.linearRampToValueAtTime(1, attack);
    }
    audioNode.triggerAttack(e.name, undefined, e.velocity);
  }
  noteOff = e => {
    const audioNode = this.props.instrument.get('audioNode');
    const release = audioNode.get('envelope').release;
    if (e.totalPlaying === 0) {
      this.props.instrument.getIn(['lfoGain']).gain.linearRampToValueAtTime(0, release);
      this.props.instrument.getIn(['lfo1Gain']).gain.linearRampToValueAtTime(0, release);
      this.props.instrument.getIn(['lfo', 'tone']).stop(release);
      this.props.instrument.getIn(['lfo1', 'tone']).stop(release);
    }
    audioNode.triggerRelease(e.name);
  }
  render() {
    const { classes, children, path, setEffect, instrument } = this.props;
    const instrumentId = instrument.get('id');
    const filter = instrument.get('filter');
    const lfo = instrument.get('lfo');
    const lfo1 = instrument.get('lfo1');
    const audioNode = instrument.get('audioNode');
    return (
      <InstrumentContext.Provider value={this.props}>
        <PageContainer>
          <Grid container spacing={1}>
            <Switch>
              <Route
                exact
                path={`${path}/instrument`}
                render={() => (
                  <>
                    <SynthComponents synthComponents={instrument.get('synthComponents')} />
                    <Lfo label="Lfo (Cutoff)" name="lfo" preset={lfo.get('preset')} setValue={setEffect(instrumentId, ['lfo'])(lfo.get('preset'), lfo.get('tone'))} />
                    <Lfo label="Lfo (Q)" name="lfo" preset={lfo1.get('preset')} setValue={setEffect(instrumentId, ['lfo1'])(lfo1.get('preset'), lfo1.get('tone'))} />
                    <BaseCard label="Filter">
                      <Filter preset={filter.get('preset')} tone={filter.get('tone')} setEffect={setEffect(instrumentId, ['filter'])(filter.get('preset'), filter.get('tone'))} />
                    </BaseCard>
                  </>
                )}
              />
              <Route
                exact
                path={`${path}/effects`}
                render={() => (
                  <EffectChain
                    instrumentId={instrumentId}
                    inputNode={audioNode}
                    outputNode={this.props.output}
                  />
                )}
              />
              <Redirect to={`${path}/instrument`} />
            </Switch>
            <Grid item xs={12}>
              <Paper className={clsx(classes.paper, classes.keyboardContainer)}>
                <div>
                  <Visualization source={this.props.output} />
                </div>
                <Grid container spacing={1}>
                  <SliderComponents
                    instrument={instrument}
                    updateInstrument={this.props.updateInstrument}
                  />
                </Grid>
                <KeyBoard polyphonic={instrument.get('voices')} noteOff={this.noteOff} noteOn={this.noteOn} />
              </Paper>
            </Grid>
          </Grid>
        </PageContainer>
      </InstrumentContext.Provider>
    )
  }
}

export default withStyles(styles)(Instrument);