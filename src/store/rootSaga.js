import { put, takeEvery, all, select, setContext } from 'redux-saga/effects'
import { Map } from 'immutable';
import { selectInstruments } from './instruments/selectors'
import audioPlayerWatcher from './audioPlayerSaga';
import createDuoSynth from './instruments/DuoSynth';
import createFMSynth from './instruments/FMSynth';
import createAMSynth from './instruments/AMSynth';
import createPluckSynth from './instruments/PluckSynth';
import createSequencer from './instruments/Sequencer';
import { actionType } from './instruments/actions'
import { actionType as trackActions } from './tracks/actions'
import { selectTracks } from './tracks/selectors';
import saveSongWatcher from './savedSongs/sagas';

const createInstrumentMap = {
  AMSynth: trackId => createAMSynth({ trackId }),
  FMSynth: trackId => createFMSynth({ trackId }),
  DuoSynth: trackId => createDuoSynth({ trackId }),
  PluckSynth: trackId => createPluckSynth({ trackId }),
  sequencer: trackId => createSequencer({ trackId, name: 'Sequencer', displayName: 'Sequencer' }),
}

function* addTrack(action) {
  const tracks = yield select(selectTracks);
  const instrument = createInstrumentMap[action.payload.value](tracks.size);
  yield put({ type: actionType.CREATE_INSTRUMENT, id: instrument.id, payload: instrument })
  yield put({ type: trackActions.CREATE_TRACK, payload: { id: tracks.size, instrumentId: instrument.id, title: action.payload.label, type: action.instrumentType } })
}

function* addTrackWatcher() {
  yield takeEvery(trackActions.ADD_TRACK, addTrack)
}

export default function* rootSaga(persistor) {
  yield setContext({ persistor })
  yield all([
    audioPlayerWatcher(),
    addTrackWatcher(),
    saveSongWatcher(),
  ])
}