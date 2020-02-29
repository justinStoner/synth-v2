import { combineReducers } from 'redux';
import Tone from 'tone';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import immutableTransform from 'redux-persist-transform-immutable'
import instruments from './instruments/reducer';
import audioInstruments from './instruments/audioReducer';
import tracks from './tracks/reducer';
import clips from './clips/reducer';
// import { Instrument } from './instruments/models';
import { Track } from './tracks';
import { Clip } from './clips';
import { Instrument } from './instruments/models';
import savedSongs from './savedSongs/reducer';

export const appActions = {
  INITIALIZE_AUDIO: 'INITIALIZE_AUDIO',
  APP_INITIALIZED: 'APP_INITIALIZED',
  PLAY_AUDIO: 'PLAY_AUDIO',
  STOP_AUDIO: 'STOP_AUDIO',
}

export const initializeAudio = () => ({
  type: appActions.INITIALIZE_AUDIO,
})

export const playAudio = payload => ({
  type: appActions.PLAY_AUDIO,
  payload,
})

export const stopAudio = payload => ({
  type: appActions.STOP_AUDIO,
  payload,
})

const player = (state = 'paused', action) => {
  switch (action.type) {
  case appActions.PLAY_AUDIO:
    return 'playing'
  case appActions.STOP_AUDIO:
    return 'stopped'
  default:
    return state;
  }
}

const appInitialized = (state = false, action) => {
  if (action.type === appActions.APP_INITIALIZED) {
    return true;
  }
  return state;
}

export const instrumentsConfig = {
  key: 'instruments',
  transforms: [immutableTransform({ records: [Instrument] })],
  whitelist: ['instruments'],
  storage,
  throttle: 5000,
}

export const tracksConfig = {
  key: 'tracks',
  transforms: [immutableTransform({ records: [Track] })],
  storage,
  throttle: 5000,
}

export const clipsConfig = {
  key: 'clips',
  transforms: [immutableTransform({ records: [Clip] })],
  storage,
  throttle: 5000,
}

const savedSongsConfig = {
  key: 'savedSongs',
  storage,
  throttle: 5000,
}

const appReducer = combineReducers({
  instruments: persistReducer(instrumentsConfig, instruments),
  audioInstruments,
  tracks: persistReducer(tracksConfig, tracks),
  clips: persistReducer(clipsConfig, clips),
  savedSongs: persistReducer(savedSongsConfig, savedSongs),
  player,
  output: () => Tone.Master,
  appInitialized,
  BPM: () => 180,
  BPMe: () => 4,
  SPB: () => 4,
})

export default appReducer;

export const selectOutput = state => state.output;
export const selectBPM = state => state.BPM;
export const selectBPMe = state => state.BPMe;
export const selectSPB = state => state.SPB;
export const selectPlayer = state => state.player;
export const selectAppInitialized = state => state.appInitialized;