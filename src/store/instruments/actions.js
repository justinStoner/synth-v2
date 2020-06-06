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

  REGISTER_INSTRUMENT: 'REGISTER_INSTRUMENT',
  UNREGISTER_INSTRUMENT: 'UNREGISTER_INSTRUMENT',

  PLAY_INSTRUMENT: 'PLAY_INSTRUMENT',
  STOP_INSTRUMENT: 'STOP_INSTRUMENT',

  CLEAR_AUDIO_INSTRUMENTS: 'CLEAR_AUDIO_INSTRUMENTS',
}

export const stopInstrument = (id, payload) => ({
  type: actionType.STOP_INSTRUMENT,
  payload,
  id,
})

export const playInstrument = (id, payload) => ({
  type: actionType.PLAY_INSTRUMENT,
  payload,
  id,
})

export const registerAudioNode = (id, payload) => ({
  type: actionType.REGISTER_INSTRUMENT,
  payload,
  id,
})

export const unregisterAudioNode = id => ({
  type: actionType.UNREGISTER_INSTRUMENT,
  id,
})

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