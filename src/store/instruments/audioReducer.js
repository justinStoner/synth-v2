import { Record, Map } from 'immutable';
import Tone from 'tone';
import { actionType } from './actions';

// const initialState = {
//   [amSynth.audioState.id]: amSynth.audioState,
//   [fmSynth.audioState.id]: fmSynth.audioState,
//   [duoSynth.audioState.id]: duoSynth.audioState,
//   [pluckSynth.audioState.id]: pluckSynth.audioState,
// }

const initialState = Map({})

const reducer = (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
  case actionType.CLEAR_AUDIO_INSTRUMENTS:
    return initialState;
  case actionType.CREATE_AUDIO_INSTRUMENT:
    return state.set(payload.id, payload);
  case actionType.REGISTER_INSTRUMENT:
    return state.set(action.id, payload);
  default:
    return state
  }
}

export default reducer;