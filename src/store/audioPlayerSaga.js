import { put, takeLatest, all, select } from 'redux-saga/effects'
import Tone from 'tone';
import { appActions, selectOutput, selectBPM, selectSPB, selectBPMe } from './appReducer'
import { selectInstruments, selectAudioInstruments } from './instruments/selectors'
import { selectClips } from './clips/selectors';
import { selectTracks } from './tracks/selectors';

function* playAudio() {
  const clips = yield select(selectClips)
  const instruments = yield select(selectAudioInstruments);
  const tracks = yield select(selectTracks)
  const BPM = yield select(selectBPM);
  const BPMe = yield select(selectBPMe);
  const SPB = yield select(selectSPB);
  clips.valueSeq().forEach(clip => {
    const notes = clip.notes.valueSeq();
    if (notes.size > 0) {
      const sampleOffset = Tone.Time(clip.time).toTicks()
      const samples = notes.map((note, i) => ({
        time: note.time,
        endTime: note.endTime,
        duration: note.duration,
        note: note.title,
        velocity: note.velocity,
      })).toJS();
      const part = new Tone.Part(function(time, value) {
        const instrument = instruments.get(tracks.getIn([clip.trackId, 'instrumentId'])).instrument;
        instrument.triggerAttackRelease(value.note, value.duration, time, value.velocity)
      }, samples).start(clip.time);

    }
  });
  Tone.Transport.bpm.value = BPM;
  Tone.Transport.timeSignature = [BPMe, SPB];
  Tone.Transport.start('+0.1');
}

function* stopAudio() {
  Tone.Transport.cancel();
  Tone.Transport.stop();
}

export default function* audioPlayerWatcher() {
  yield all([
    takeLatest(appActions.PLAY_AUDIO, playAudio),
    takeLatest(appActions.STOP_AUDIO, stopAudio),
  ])
}