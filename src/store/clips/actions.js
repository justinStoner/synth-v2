export const actionType = {
  ADD_CLIP: 'ADD_CLIP',
  UPDATE_CLIP: 'UPDATE_CLIP',
  DELETE_CLIP: 'DELETE_CLIP',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  RESET_CLIPS: 'RESET_CLIPS',
}

export const addClip = payload => ({
  type: actionType.ADD_CLIP,
  payload,
})

export const deleteClip = key => ({
  type: actionType.DELETE_CLIP,
  key,
})

export const updateClip = (key, payload) => ({
  type: actionType.UPDATE_CLIP,
  key,
  payload,
})

export const addNote = (key, payload) => ({
  type: actionType.ADD_NOTE,
  key,
  payload,
})

export const deleteNote = key => ({
  type: actionType.DELETE_NOTE,
  key,
})

export const updateNote = (key, payload) => ({
  type: actionType.UPDATE_NOTE,
  key,
  payload,
})