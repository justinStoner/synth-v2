export const actionType = {
  ADD_EFFECT: 'ADD_EFFECT',
  DELETE_EFFECT: 'DELETE_EFFECT',
  UPDATE_EFFECT: 'UPDATE_EFFECT',
  MOVE_EFFECT: 'MOVE_EFFECT',
  ADD_INSTRUMENT: 'ADD_INSTRUMENT',
  CREATE_INSTRUMENT: 'CREATE_INSTRUMENT',
  UPDATE_INSTRUMENT: 'UPDATE_INSTRUMENT',
  DELETE_INSTRUMENT: 'DELETE_INSTRUMENT',
  RESET_INSTRUMENT: 'RESET_INSTRUMENT',

  CREATE_AUDIO_INSTRUMENT: 'CREATE_AUDIO_INSTRUMENT',
  RESET_AUDIO_INSTRUMENT: 'RESET_AUDIO_INSTRUMENT',
  CLEAR_AUDIO_INSTRUMENTS: 'CLEAR_AUDIO_INSTRUMENTS',

  ADD_AUDIO_EFFECT: 'ADD_AUDIO_EFFECT',
}

export const moveEffect = (id, fromIndex, toIndex) => ({
  type: actionType.MOVE_EFFECT,
  fromIndex,
  toIndex,
  id,
})

export const addEffect = (id, payload) => ({
  type: actionType.ADD_EFFECT,
  payload,
  id,
})

export const addAudioEffect = (id, payload) => ({
  type: actionType.ADD_AUDIO_EFFECT,
  payload,
  id,
})

export const addInstrument = (trackId, payload) => ({
  type: actionType.ADD_INSTRUMENT,
  trackId,
  payload,
})

export const deleteEffect = (id, index) => ({
  type: actionType.DELETE_EFFECT,
  index,
  id,
})

export const updateInstrument = (id, path, payload) => ({
  type: actionType.UPDATE_INSTRUMENT,
  path,
  payload,
  id,
})

export const updateEffect = (id, path, valueName, payload) => ({
  type: actionType.UPDATE_EFFECT,
  path,
  valueName,
  payload,
  id,
})