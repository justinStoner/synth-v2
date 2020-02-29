import React from 'react';
import PT from 'prop-types';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import * as acetone from '../../assets/audio/acetone-rhythm';
import { withStyles } from '@material-ui/core';
import InstrumentContext from '../../context/InstrumentContext';
import EffectChain from '../EffectChain';
import { SliderWithLabel } from '../Slider';
import BaseCard from '../AudioNodes/BaseCard';
import Filter from '../AudioNodes/Filter';

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

class Sequencer extends React.PureComponent {
  static propTypes = {
    instrument: PT.string.isRequired,
    output: PT.object.isRequired,
  }

  noteOn = e => {
    const { instrument, lfo, lfo1, lfoGain, lfo1Gain } = this.props.audioInstrument;
    const attack = instrument.get('envelope').attack;
    if (e.totalPlaying === 1) {
      lfo.start();
      lfo1.start();
      lfoGain.gain.linearRampToValueAtTime(1, attack);
      lfo1Gain.gain.linearRampToValueAtTime(1, attack);
    }
    instrument.triggerAttack(e.name, undefined, e.velocity);
  }
  noteOff = e => {
    const { instrument, lfo, lfo1, lfoGain, lfo1Gain } = this.props.audioInstrument;
    const release = instrument.get('envelope').release;
    if (e.totalPlaying === 0) {
      lfoGain.gain.linearRampToValueAtTime(0, release);
      lfo1Gain.gain.linearRampToValueAtTime(0, release);
      lfo.stop(release);
      lfo1.stop(release);
    }
    instrument.triggerRelease(e.name);
  }
  render() {
    const { classes, setEffect, instrument, audioInstrument } = this.props;
    return (
      <InstrumentContext.Provider value={this.props}>
        {this.props.render({
          synthComponents,
          synthControls: controls,
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

export default withStyles(styles)(Sequencer);