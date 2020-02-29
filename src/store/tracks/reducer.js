import { createTrack } from '.'
import { List } from 'immutable';
import { actionType } from './actions';

const initialState = {
  tracks: new List([
    createTrack({ id: 0, instrumentId: 'AMSynth', title: 'AMSynth' }),
    createTrack({ id: 1, instrumentId: 'FMSynth', title: 'FMSynth' }),
    createTrack({ id: 2, instrumentId: 'DuoSynth', title: 'DuoSynth' }),
    createTrack({ id: 3, instrumentId: 'PluckSynth', title: 'PluckSynth' }),
  ]),
};

const reducer = (state = initialState, action) => {
  const { payload } = action;
  const { tracks } = state;
  switch (action.type) {
  case actionType.RESET_TRACKS:
    return payload;
  case actionType.UPDATE_CHANNEL_VOLUME:
    return { tracks: tracks.setIn([payload.index, 'volume'], payload.volume) }
  case actionType.CREATE_TRACK:
    return { tracks: tracks.push(createTrack(payload)) }
  default:
    return state;
  }
}

export default reducer;