import { actionType } from './actions';

const initialState = {
  songs: [],
  loadedSong: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case actionType.CREATE_SONG:
    return { ...state, songs: state.songs.concat([action.payload]) };
  case actionType.SET_SONG:
    return Object.assign({}, state, { loadedSong: action.payload })
  default:
    return state;
  }
}

export default reducer;