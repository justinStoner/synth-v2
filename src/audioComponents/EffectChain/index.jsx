import React from 'react';
import Tone from 'tone';
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
  constructor(props) {
    super(props);
    const { effect: e } = this.props;
  }


  componentWillUnmount() {
    const { input, output, effect } = this.props;
    removeNode(effect, input, output);
  }
  componentDidMount() {
    const { input, output, hasEffectChainMounted, onMount, effect } = this.props;
    connectNode(effect, input, output, hasEffectChainMounted)
    onMount();
  }

  componentDidUpdate(prevProps) {
    const { effect, preset, index, input, output } = this.props;
    effect.set(preset.toJS())
    if (prevProps.index !== index) {
      moveNode(effect, input, output, prevProps.input, prevProps.output, prevProps.index, index)
    }
  }

  render() {
    return null;
  }
}

class EffectChain extends React.PureComponent {

  state = { hasEffectChainMounted: false }

  constructor(props) {
    super(props);
    this.effects = Object.assign({}, ...this.props.effects.toArray().map(e => ({ [e.get('id')]: new Tone[e.get('constructor')](e.get('preset').toJS()) })))
  }

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
    const { input, output, effects } = this.props;
    return (
      <>
        {
          effects.toArray().map((e, index, arr) => {
            const id = e.get('id');
            if (!this.effects[id]) {
              this.effects[id] = new Tone[e.get('constructor')](e.get('preset').toJS())
            }
            return (
              <AudioErrorBoundary key={id} name={e.get('name')}>
                <Effect
                  input={index === 0 ? input : this.effects[arr[index-1].get('id')]}
                  output={index === arr.length - 1 ? output : this.effects[arr[index+1].get('id')] }
                  effect={this.effects[id]}
                  preset={e.get('preset')}
                  index={index}
                  hasEffectChainMounted={this.state.hasEffectChainMounted}
                  onMount={() => this.onEffectMount(index, arr)}
                />
              </AudioErrorBoundary>
            )
          })
        }
      </>
    )
  }
}

const stp = state => ({
})

export default connect(stp)(withAudioErrorBoundary(EffectChain, 'EffectChain'))