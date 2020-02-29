import { select, takeEvery, all, put } from 'redux-saga/effects';
import { actionType } from './actions';
import { selectAudioInstruments } from './selectors';

function* resetAudioInstruments() {
  const audioInstruments = yield select(selectAudioInstruments);
  for (const i of audioInstruments.valueSeq().toJS()) {
    Object.values(i).forEach(node => {
      if (Array.isArray(node)) {
        node.forEach(node => {
          node.effect.dispose()
        })
      } else {
        if (node.dispose) {
          node.dispose();
        }
      }
    })
  }
  yield put({ type: actionType.CLEAR_AUDIO_INSTRUMENTS })
}

export default function* audioSyncSagas() {
  yield all([
    takeEvery(actionType.RESET_AUDIO_INSTRUMENT, resetAudioInstruments),
  ])
}