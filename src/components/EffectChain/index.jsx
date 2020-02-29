import React from 'react';
import PT from 'prop-types';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import PageContainer from '../PageContainer';
import EffectChainContext from '../../context/EffectChainContext';
import { effectPresets, effectPresetsList, effectMenuItems } from './presets';
import Effect from '../AudioNodes/Effect';
import { withAudioContext } from '../../context/AudioContext';
import { moveEffect, addEffect, deleteEffect, addAudioEffect } from '../../store/instruments/actions';

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

  addEffect = (effect, index) => {

  }

  moveEffect = (fromIndex, toIndex) => {
    this.props.moveEffect(this.props.instrumentId, fromIndex, toIndex)
  }


  getOutputNode = index => index + 1 === this.props.effectChain.size ? this.props.outputNode : this.props.effectChain.getIn([index + 1, 'tone'])

  getInputNode = index => index === 0 ? this.props.inputNode : this.props.effectChain.getIn([index -1, 'tone'])

  removeEffect = index => {
    this.props.deleteEffect(this.props.instrumentId, index);
  }

  render() {
    const { instrumentId, effectChain, effectChainNodes } = this.props;
    const { menuAnchor } = this.state;
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
                onClick={() => {this.props.addEffect(this.props.instrumentId, effectPresets[item.value]())}}
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
              tone={effectChainNodes[value.get('id')].effect}
              preset={value.get('preset')}
              noWet={value.get('noWet')}
              index={index}
              addEffect={this.addEffect}
              removeEffect={this.removeEffect}
              moveEffect={this.moveEffect}
              setEffect={this.props.setEffect(instrumentId, ['effects', index])}
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

const mapDispatchToProps = dispatch => ({
  moveEffect: (id, fromIndex, toIndex) => dispatch(moveEffect(id, fromIndex, toIndex)),
  addEffect: (id, payload) => {
    dispatch(addAudioEffect(id, payload.audioState));
    dispatch(addEffect(id, payload.uiState));
  },
  deleteEffect: (id, index) => dispatch(deleteEffect(id, index)),
})

export default withStyles(styles)(connect(undefined, mapDispatchToProps)(EffectChain));