import { takeLatest, getContext, call, put, all } from 'redux-saga/effects'
import uuid from 'uuid/v4';
import lzutf8 from 'lzutf8';
import { actionType } from './actions';
import { actionType as clipsActions } from '../clips/actions';
import { actionType as tracksActions } from '../tracks/actions';
import { actionType as instrumentActions } from '../instruments/actions';
import { getStoredState } from 'redux-persist';
import { tracksConfig, clipsConfig, instrumentsConfig, appActions } from '../appReducer';

const compress = input => lzutf8.compress(input, { outputEncoding: 'StorageBinaryString' })

const decompress = input => lzutf8.decompress(input, { inputEncoding: 'StorageBinaryString' })

function* saveSong(action) {
  const { payload } = action;
  const persistor = yield getContext('persistor');
  yield call(async () => {
    persistor.persist();
    return await persistor.flush();
  });
  const instruments = compress(localStorage.getItem('persist:instruments'));
  const tracks = compress(localStorage.getItem('persist:tracks'));
  const clips = compress(localStorage.getItem('persist:clips'));
  const id = payload.id === null ? uuid() : payload.id;
  localStorage.setItem(id, JSON.stringify({ instruments, tracks, clips }))
  yield put({ type: actionType.CREATE_SONG, payload: { name: payload.name, id } })
}

function* loadSong(action) {
  const { payload } = action;
  const { instruments, tracks, clips } = JSON.parse(localStorage.getItem(payload));
  localStorage.setItem('persist:instruments', decompress(instruments));
  localStorage.setItem('persist:tracks', decompress(tracks));
  localStorage.setItem('persist:clips', decompress(clips));
  const persistor = yield getContext('persistor');
  persistor.pause();
  const actions = yield call(async() => await Promise.all([
    { type: instrumentActions.RESET_INSTRUMENT,config: instrumentsConfig },
    { type: tracksActions.RESET_TRACKS, config: tracksConfig },
    { type: clipsActions.RESET_CLIPS, config: clipsConfig },
  ].map(async ({ type, config }) => {
    const payload = await getStoredState(config);
    return ({
      type,
      payload,
    })
  })));
  for (const i of actions) {
    yield put(i);
  }
  yield put({ type: actionType.SET_SONG, payload });
  persistor.persist();
}

export default function* saveSongWatcher() {
  yield all([
    takeLatest(actionType.SAVE_SONG, saveSong),
    takeLatest(actionType.LOAD_SONG, loadSong),
  ])
}