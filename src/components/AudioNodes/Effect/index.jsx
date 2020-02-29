import React, { useEffect, useState } from 'react';
import { withStyles, Card } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import BackIcon from '@material-ui/icons/ChevronLeft';
import NextIcon from '@material-ui/icons/ChevronRight';
import BaseCard, { FullWidthSelect, HeaderSelect } from '../BaseCard';
import { withEffectContext } from '../../../context/EffectChainContext';
import Reverb from '../Reverb';
import Chorus from '../Chorus';
import Delay from '../Delay';
import { SliderWithLabel } from '../../Slider';
import Phaser from '../Phaser';
import { presets } from '../../EffectChain/presets';
import Compressor from '../Compressor';
import Filter from '../Filter';

const styles = theme => ({
  textField: {
  },
});

const getComponent = ({ name, ...rest }) => {
  switch (name) {
  case 'reverb':
    return <Reverb {...rest} />;
  case 'chorus':
    return <Chorus {...rest} />;
  case 'phaser':
    return <Phaser {...rest} />;
  case 'delay':
    return <Delay {...rest} />
  case 'compressor':
    return <Compressor {...rest} />
  case 'filter':
    return <Filter {...rest} />
  default:
    return null;
  }
}

export const setWet = (node, value) => {
  node.wet.value = value;
}

class Effect extends React.PureComponent {

  render() {
    const { label = 'Effect', effectChainSize, preset, noWet, name, tone, index, addEffect, removeEffect, inputNode, outputNode, setTone, moveEffect } = this.props;
    const setValue = this.props.setEffect(preset, tone, inputNode, outputNode);
    return (
      <BaseCard
        label={label}
        headerComponent={!noWet && <SliderWithLabel
          onChange={setValue('wet', setWet)}
          label="Dry/wet" value={preset.get('wet')}
          min={0.01}
          max={1}
          step={0.1}
          style={{ padding: 0 }}
          containerProps={{ style: { float: 'right' } }}
        />}
      >
        {getComponent({ name, preset, tone, setEffect: setValue, addEffect, removeEffect, inputNode, outputNode })}
        <CardActions style={{ margin: '-8px -8px', padding: 0 }}>
          <IconButton onClick={() => {removeEffect(index)}}>
            <DeleteIcon />
          </IconButton>
          <IconButton disabled={index ===0} onClick={() => {moveEffect(index, index - 1)}}>
            <BackIcon />
          </IconButton>
          <IconButton disabled={index + 1 === effectChainSize} onClick={() => {moveEffect(index, index + 1)}}>
            <NextIcon />
          </IconButton>
        </CardActions>
      </BaseCard>
    );
  }
}

export default withStyles(styles)(withEffectContext(React.memo(Effect), 'effect'))