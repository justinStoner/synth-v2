import { createClip, createClipNote } from '.'
import Tone from 'tone'
import { List, Map } from 'immutable';
import { actionType } from './actions';

const notes = ['C3', 'E3', 'G3', 'B3', 'C4', 'B3', 'G3', 'E3']

const notes1 = ['B2', 'E3', 'G3', 'B3', 'C4', 'B3', 'G3', 'E3']

const SPB = 4;

const initialState = {
  clips: new Map(
    Object.assign({}, ...[createClip({ SPB, start: 1, end: 3, stepEnd: 1, trackId: 0, index: 0, instrumentId: 'AMSynth', notes: new Map(
      Object.assign({}, ...notes.map((n, i) => {
        const note = Tone.Frequency(n).toMidi()
        const clip = createClipNote({
          SPB,
          clipId: 0,
          title: n,
          note,
          index: i,
          start: i + 1,
          end: i + 2,
          stepStart: i + 1,
          stepEnd: i + 2,
        })
        return { [clip.key]: clip }
      }))
    ),
    }),
    createClip({ SPB, start: 3, end: 5, stepEnd: 1, trackId: 0, index: 1, instrumentId: 'AMSynth', notes: new Map(
      Object.assign({}, ...notes.map((n, i) => {
        const note = Tone.Frequency(n).toMidi()
        const clip = createClipNote({
          SPB,
          clipId: 1,
          title: n,
          note,
          index: i,
          start: i + 1,
          end: i + 2,
          stepStart: i + 1,
          stepEnd: i + 2,
        })
        return { [clip.key]: clip }
      }))
    ),
    }),
    createClip({ SPB, start: 5, end: 7, stepEnd: 1, trackId: 0, index: 2, instrumentId: 'AMSynth', notes: new Map(
      Object.assign({}, ...notes.map((n, i) => {
        const note = Tone.Frequency(n).toMidi()
        const clip = createClipNote({
          SPB,
          clipId: 2,
          title: n,
          note,
          index: i,
          start: i + 1,
          end: i + 2,
          stepStart: i + 1,
          stepEnd: i + 2,
        })
        return { [clip.key]: clip }
      }))
    ),
    }),
    createClip({ SPB, start: 7, end: 9, stepEnd: 1, trackId: 0, index: 3, instrumentId: 'AMSynth', notes: new Map(Object.assign({}, ...notes.map((n, i) => {
      const note = Tone.Frequency(n).toMidi()
      const clip = createClipNote({
        SPB,
        clipId: 3,
        title: n,
        note,
        index: i,
        start: i + 1,
        end: i + 2,
        stepStart: i + 1,
        stepEnd: i + 2,
      })
      return { [clip.key]: clip }
    }))),
    }),
    ].map(clip => ({ [clip.key]: clip })))
  ),
};

const reducer = (state = initialState, action) => {
  const { payload } = action;
  const { clips } = state;
  switch (action.type) {
  case actionType.RESET_CLIPS:
    return payload
  case actionType.ADD_CLIP:
    return { clips: clips.set(payload.key, payload) }
  case actionType.DELETE_CLIP:
    return { clips: clips.delete(action.key) }
  case actionType.UPDATE_CLIP:
    return { clips: clips.mergeIn([...action.key], payload) }
  case actionType.ADD_NOTE:
    return { clips: clips.setIn([action.key, 'notes', payload.key], payload) }
  case actionType.DELETE_NOTE:
    return { clips: clips.deleteIn(action.key) }
  case actionType.UPDATE_NOTE:
    return { clips: clips.updateIn([...action.key], item => item.merge(payload)) }
  default:
    return state;
  }
}

export default reducer;