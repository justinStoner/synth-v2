import { put, takeEvery, all, select, call, setContext, getContext } from 'redux-saga/effects'
import { appActions, selectOutput, selectAppInitialized } from './appReducer'
import Tone from 'tone';
import { Map } from 'immutable';
import { selectInstruments } from './instruments/selectors'
import audioPlayerWatcher from './audioPlayerSaga';
import createDuoSynth from './instruments/DuoSynth';
import createFMSynth from './instruments/FMSynth';
import createAMSynth from './instruments/AMSynth';
import createPluckSynth from './instruments/PluckSynth';
import { actionType } from './instruments/actions'
import { actionType as trackActions } from './tracks/actions'
import { selectTracks } from './tracks/selectors';
import { tonePresets } from '../containers/Synth/presets';
import { AudioInstrument } from './instruments/models';
import saveSongWatcher from './savedSongs/sagas';
import audioSyncSagas from './instruments/audioSyncSaga';

const createInstrumentMap = {
  AMSynth: trackId => createAMSynth({ trackId }),
  FMSynth: trackId => createFMSynth({ trackId }),
  DuoSynth: trackId => createDuoSynth({ trackId }),
  PluckSynth: trackId => createPluckSynth({ trackId }),
  sequencer: () => new Map(),
}

const createSynthFromName = (name, voices = 4, preset = 0) => {
  switch(name) {
  case 'PluckSynth':
    return new Tone.PluckSynth(tonePresets[name][preset])
  default:
    return new Tone.PolySynth(voices, Tone[name], tonePresets[name][preset])
  }
}

const connectInstrument = (i, output) => {
  const filter = new Tone.Filter(i.filter.preset);
  const instrumentOut = new Tone.Gain();
  const channelOut = new Tone.Channel();
  const lfo = new Tone.LFO(i.lfo.preset);
  const lfo1 = new Tone.LFO(i.lfo1.preset);
  const lfoGain = new Tone.Gain({ gain: 0 });
  const lfo1Gain = new Tone.Gain({ gain: 0 });
  const synth = createSynthFromName(i.name);
  const effects = i.effects.map(effect => new Tone[effect.constructor](effect.preset));

  // synth.chain(filter, instrumentOut, ...effects, channelOut, output)
  // lfo.chain(lfoGain, filter.frequency);
  // lfo1.connect(lfo1Gain, filter.Q);

  return new AudioInstrument({
    id: i.id,
    trackId: i.trackId,
    type: i.type,
    instrument: synth,
    lfo,
    lfo1,
    lfo1Gain,
    lfoGain,
    filter,
    instrumentOut,
    channelOut,
    intitialized: true,
    effects: Object.assign({}, ...effects.map((e, ind) => ({ [i.effects[ind].id]: { effect: e, id: i.effects[ind].id, type: i.effects[ind].type, noWet: i.effects[ind].noWet } }))),
  })
}

function* initializeAudio() {
  const instruments = yield select(selectInstruments);
  const output = yield select(selectOutput);
  for(const i of instruments.valueSeq().toJS()){
    const audioInstrument = connectInstrument(i, output);
    yield put({ type: actionType.CREATE_AUDIO_INSTRUMENT, id: i.id, payload: audioInstrument })
  }
  yield put({ type: appActions.APP_INITIALIZED })
}

function* initializeInstrument(action) {
  const output = yield select(selectOutput);
  const instrument = createInstrumentMap[action.payload](action.trackId);
  connectInstrument(instrument, output)
  yield put({ type: actionType.CREATE_INSTRUMENT, id: instrument.id, payload: instrument })
}

function* addTrack(action) {
  const output = yield select(selectOutput);
  const tracks = yield select(selectTracks);
  const instrument = createInstrumentMap[action.payload.value](tracks.size);
  const audioInstrument = connectInstrument(instrument.toJS(), output)
  yield put({ type: actionType.CREATE_INSTRUMENT, id: instrument.id, payload: instrument })
  yield put({ type: actionType.CREATE_AUDIO_INSTRUMENT, id: instrument.id, payload: audioInstrument })
  yield put({ type: trackActions.CREATE_TRACK, payload: { id: tracks.size, instrumentId: instrument.id, title: action.payload.label } })
}

function* setChannelVolume(action) {
  const instrument = yield select(selectInstruments);
  instrument.getIn([action.instrumentId, 'channelOut']).volume.value = action.payload.volume;
  yield put({ type: trackActions.UPDATE_CHANNEL_VOLUME, payload: action.payload })
}

function* initializeAudioWatcher() {
  yield takeEvery(appActions.INITIALIZE_AUDIO, initializeAudio)
}

function* initializeInstrumentWatcher() {
  yield takeEvery(actionType.ADD_INSTRUMENT, initializeInstrument)
}

function* addTrackWatcher() {
  yield takeEvery(trackActions.ADD_TRACK, addTrack)
}

function* setChannelVolumeWatcher() {
  yield takeEvery(trackActions.SET_CHANNEL_VOLUME, setChannelVolume)
}

export default function* rootSaga(persistor) {
  yield setContext({ persistor })
  yield all([
    initializeAudioWatcher(),
    audioPlayerWatcher(),
    initializeInstrumentWatcher(),
    addTrackWatcher(),
    setChannelVolumeWatcher(),
    saveSongWatcher(),
    audioSyncSagas(),
  ])
}