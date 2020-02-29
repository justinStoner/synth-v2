import React from 'react';
import { connect } from 'react-redux';
import AudioErrorBoundary, { withAudioErrorBoundary } from '../AudioErrorBoundary';

const moveNode = (node, newInput, newOutput, oldInput, oldOutput, fromIndex, toIndex) => {
  try {
    oldInput.disconnect(node);
    if (fromIndex > toIndex) {node.disconnect(oldOutput)}
    newInput.chain(node, newOutput);
  } catch (error) {
    console.log(error)
  }
}

const removeNode = (node, input, output) => {
  input.disconnect(node);
  node.disconnect(output);
  input.connect(output);
  node.dispose();
}

const connectNode = (node, input, output, createdAfterInitialization) => {
  try {

    if (createdAfterInitialization) {
      input.disconnect(output);
    }
    input.connect(node);
    node.connect(output);
  } catch (e) {
    console.log(e);
  }
}

class Effect extends React.PureComponent {
  componentWillUnmount() {
    const { audioEffect, input, output } = this.props;
    removeNode(audioEffect, input, output);
  }
  componentDidMount() {
    const { audioEffect, input, output, hasEffectChainMounted, onMount } = this.props;
    connectNode(audioEffect, input, output, hasEffectChainMounted)
    onMount();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.index !== this.props.index) {
      const { input, output, audioEffect, index } = this.props;
      moveNode(audioEffect, input, output, prevProps.input, prevProps.output, prevProps.index, index)
    }
  }

  render() {
    return null;
  }
}

class EffectChain extends React.PureComponent {

  state = { hasEffectChainMounted: false }

  componentDidMount() {
    const { input, output, effects } = this.props;
    if (effects.size === 0) {
      input.connect(output);
    }
    this.setState({ hasEffectChainMounted: true })
  }

  componentWillUnmount() {

  }

  onEffectMount = (index, arr) => {
    if (index === arr.length - 1 && !this.state.hasEffectChainMounted) {
      this.setState({ hasEffectChainMounted: true })
    }
  }

  render() {
    const { input, output, effects, audioEffects } = this.props;
    return (
      <>
        {
          effects.toArray().map((e, index, arr) => (
            <AudioErrorBoundary key={e.get('id')} name={e.get('name')}>
              <Effect
                input={index === 0 ? input : audioEffects[arr[index-1].get('id')].effect}
                output={index === arr.length - 1 ? output : audioEffects[arr[index+1].get('id')].effect }
                audioEffect={audioEffects[e.get('id')].effect}
                index={index}
                hasEffectChainMounted={this.state.hasEffectChainMounted}
                onMount={() => this.onEffectMount(index, arr)}
              />
            </AudioErrorBoundary>
          ))
        }
      </>
    )
  }
}

const stp = state => ({
})

export default connect(stp)(withAudioErrorBoundary(EffectChain, 'EffectChain'))