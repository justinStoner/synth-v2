import React from 'react';
import PT from 'prop-types';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, Button } from '@material-ui/core';
import PageContainer from '../PageContainer';
import EffectChainContext from '../../context/EffectChainContext';
import { effectPresets, effectPresetsList, effectMenuItems } from './presets';
import Effect from '../AudioNodes/Effect';
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

class EffectChain extends React.PureComponent {
  static propTypes = {
    inputNode: PT.object.isRequired,
    outputNode: PT.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      inputNode: props.inputNode,
      outputNode: props.outputNode,
      setEffect: this.setEffect,
      removeEffect: this.removeEffect,
      addEffect: this.addEffect,
      setTone: this.setTone,
      menuAnchor: null,
    };
  }

  setTone = index => tone => {
    this.setState((state, props) => ({ effectChain: state.effectChain.setIn([index, 'tone'], tone) }));
  }

  addEffect = (effect, index) => {

  }

  moveEffect = (fromIndex, toIndex) => {
    this.props.audioContext.moveNode(this.props.instrumentId, fromIndex, toIndex)
  }


  getInputNode = index => this.props.audioContext.getInputNode(this.props.instrumentId, index)

  getOutputNode = index => this.props.audioContext.getOutputNode(this.props.instrumentId, index)

  getTone = index => this.props.audioContext.getTone(this.props.instrumentId, index)

  getPreset = index => this.props.audioContext.getPreset(this.props.instrumentId, index);

  removeEffect = index => {
    this.props.audioContext.removeEffect(this.props.instrumentId, index);
  }

  render() {
    const { classes, children, audioContext, instrumentId } = this.props;
    const { inputNode, outputNode, menuAnchor } = this.state;
    const effectChain = audioContext.instruments.getIn([instrumentId, 'effects']);
    return (
      <EffectChainContext.Provider value={this.state}>
        <Grid item xs={12}>
          <Button onClick={e => {this.setState({ menuAnchor: e.currentTarget })}}>
          Add effect
          </Button>
        </Grid>
        <Menu
          id="simple-menu"
          anchorEl={menuAnchor}
          keepMounted
          open={Boolean(menuAnchor)}
          onClose={() => {this.setState({ menuAnchor: null })}}
        >
          {
            effectMenuItems.map(item => (
              <MenuItem
                key={item.value}
                onClick={() => {this.props.audioContext.addEffect(this.props.instrumentId, effectPresets[item.value]())}}
              >
                {item.label}
              </MenuItem>
            ))
          }
        </Menu>
        {
          effectChain.valueSeq().map((value, index) => (
            <Effect
              name={value.get('type')}
              key={value.get('id')}
              label={value.get('displayName')}
              tone={this.getTone(index)}
              preset={this.getPreset(index)}
              noWet={value.get('noWet')}
              index={index}
              setTone={this.setTone}
              addEffect={this.addEffect}
              removeEffect={this.removeEffect}
              moveEffect={this.moveEffect}
              setEffect={this.props.audioContext.setEffect(instrumentId, ['effects', index])}
              effectChainSize={effectChain.size}
              inputNode={this.getInputNode(index)}
              outputNode={this.getOutputNode(index)}
            />
          ))
        }
      </EffectChainContext.Provider>
    )
  }
}

export default withStyles(styles)(withAudioContext(EffectChain));