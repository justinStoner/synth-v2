import React from 'react';
import PT from 'prop-types';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core';
import Envelope from '../../components/AudioNodes/Envelope';
import Oscillator from '../../components/AudioNodes/Oscillator';
import InstrumentContext from '../../context/InstrumentContext';
import KeyBoard from '../KeyBoard/KeyBoard';
import EffectChain from '../EffectChain';
import Visualization from './Visualization';
import { SliderWithLabel } from '../Slider';
import BaseCard from '../AudioNodes/BaseCard';
import Filter from '../AudioNodes/Filter';
import Lfo from '../AudioNodes/Lfo';
import { playInstrument, stopInstrument } from '../../store/instruments/actions';

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

export const SynthComponents = React.memo(({ synthComponents, EnvelopeComponent = Envelope, OscillatorComponent = Oscillator }) => (
  <>
    {synthComponents && synthComponents.valueSeq().map((props, index) => props.component === 'envelope' ? <EnvelopeComponent {...props} key={props.name + index} /> : <OscillatorComponent {...props} key={props.name + index} />)}
  </>
));
SynthComponents.displayName = 'SynthComponents';

export const SliderComponents = React.memo(({ updateInstrument, instrument }) => {
  const sliderComponents = instrument.get('sliderComponents');
  return (
    <>
      {sliderComponents.valueSeq().map((props, index) => (
        <Grid key={props.name + index} item xs={props.size || 12 / sliderComponents.size}>
          <SliderWithLabel
            onChange={(e, value) => {
              const newVal = { [props.name]: value };
              updateInstrument(props.parent ? ['preset', props.parent] : ['preset'], newVal);
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
    const { instrument } = this.props;
    const lfo = instrument.getIn(['lfo', 'id'])
    const lfo1 = instrument.getIn(['lfo1', 'id'])
    this.props.playInstrument(instrument.get('id'), { name: e.name, velocity: e.velocity, lfo, lfo1 })
  }
  noteOff = e => {
    const { instrument } = this.props;
    this.props.stopInstrument(instrument.get('id'), e.name)
  }
  render() {
    const { classes, setEffect, instrument, audioInstrument } = this.props;
    const instrumentId = instrument.get('id');
    const filter = instrument.get('filter');
    const lfo = instrument.get('lfo');
    const lfo1 = instrument.get('lfo1');
    const synthProps = {
      synthComponents: instrument.get('synthComponents'),
    };
    const lfoProps = {
      label: 'Lfo (Cutoff)',
      name: 'lfo',
      preset: lfo.get('preset'),
      setValue: setEffect(instrumentId, ['lfo'])(lfo.get('preset')),
    };
    const lfo1Props = {
      label: 'Lfo (Q)',
      name: 'lfo',
      preset: lfo1.get('preset'),
      setValue: setEffect(instrumentId, ['lfo1'])(lfo1.get('preset')),
    };
    const filterProps = {
      preset: filter.get('preset'),
      tone: null, // audioInstrument.filter,
      setEffect: setEffect(instrumentId, ['filter'])(filter.get('preset')),
    };

    const effectProps = {
      instrumentId,
      setEffect,
      effectChain: instrument.get('effects'),
    }

    const synthComponents = (
      <>
        <SynthComponents {...synthProps} />
        <Lfo {...lfoProps} />
        <Lfo {...lfo1Props} />
        <BaseCard label="Filter">
          <Filter {...filterProps} />
        </BaseCard>
      </>
    );
    const effectComponents = (
      <EffectChain {...effectProps}/>
    )

    const synthControls = (
      <Paper className={clsx(classes.paper, classes.keyboardContainer)}>
        <div>
          {audioInstrument && <Visualization source={audioInstrument} />}
        </div>
        <Grid container spacing={1}>
          <SliderComponents
            instrument={instrument}
            updateInstrument={this.props.updateInstrument}
          />
        </Grid>
        <KeyBoard polyphonic={instrument.get('voices')} noteOff={this.noteOff} noteOn={this.noteOn} />
      </Paper>
    )

    return (
      <InstrumentContext.Provider value={this.props}>
        {this.props.render({
          synthComponents,
          synthControls,
          effectComponents,
          synthProps,
          lfoProps,
          lfo1Props,
          filterProps,
          effectProps,
        })}
      </InstrumentContext.Provider>
    )

  }
}

const dtp = dispatch => ({
  playInstrument: (id, payload) => dispatch(playInstrument(id, payload)),
  stopInstrument: (id, payload) => dispatch(stopInstrument(id, payload)),
})

export default connect(undefined, dtp)(withStyles(styles)(Instrument));