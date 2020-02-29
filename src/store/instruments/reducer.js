/* eslint-disable no-case-declarations */
import { Map } from 'immutable';
import { actionType } from './actions';
import { duoSynth } from './DuoSynth';
import { fmSynth } from './FMSynth';
import { amSynth } from './AMSynth';
import { pluckSynth } from './PluckSynth';

const moveNode = (state, id, fromIndex, toIndex) => {
  // const movingBack = fromIndex > toIndex;
  // const inputSideIndex = movingBack ? toIndex : fromIndex
  // const outputSideIndex = movingBack ? fromIndex : toIndex
  // const nodes = [
  //   getInputNode(state, id, inputSideIndex),
  //   getTone(state, id, inputSideIndex),
  //   getTone(state, id, outputSideIndex),
  //   getOutputNode(state, id, outputSideIndex),
  // ];
  // nodes.forEach((node, i) => (i !== nodes.length -1 && node.disconnect(nodes[i+1])));
  // [nodes[1], nodes[2]] = [nodes[2], nodes[1]]

  // //TODO revisit this when adding moving beyond adjacent nodes
  // nodes.forEach((node, i) => (i !== nodes.length -1 && node.connect(nodes[i+1])));

  const fromEffect = state.getIn([id, 'effects', fromIndex]);
  const toEffect = state.getIn([id, 'effects', toIndex]);
  return state.withMutations(inst => inst.setIn([id, 'effects', toIndex], fromEffect).setIn([id, 'effects', fromIndex], toEffect))
}

const initialState = {
  instruments: new Map({
    [duoSynth.id]: duoSynth,
    [amSynth.id]: amSynth,
    [fmSynth.id]: fmSynth,
    [pluckSynth.id]: pluckSynth,
  }),
}

const reducer = (state = initialState, action) => {
  const { payload } = action;
  const { instruments } = state;
  switch (action.type) {
  case actionType.RESET_INSTRUMENT:
    return payload;
  case actionType.MOVE_EFFECT:
    return { instruments: moveNode(instruments, action.id, action.fromIndex, action.toIndex) }
  case actionType.ADD_EFFECT:
    return { instruments: instruments.updateIn([action.id, 'effects'], arr => arr.push(payload)) };
  case actionType.UPDATE_EFFECT:
    return { instruments: instruments.setIn([action.id, ...action.path, 'preset', action.valueName], payload) }
  case actionType.DELETE_EFFECT:
    return { instruments: instruments.deleteIn([action.id, 'effects', action.index]) }
  case actionType.CREATE_INSTRUMENT:
    const { id } = action;
    return { instruments: instruments.set(id, payload) }
  case actionType.UPDATE_INSTRUMENT:
    return { instruments: instruments.mergeIn([action.id, ...action.path], payload) }
  case actionType.DELETE_INSTRUMENT:
  default:
    return state;
  }
}

export default reducer;