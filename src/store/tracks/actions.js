export const actionType = {
  ADD_TRACK: 'ADD_TRACK',
  CREATE_TRACK: 'CREATE_TRACK',
  UPDATE_CHANNEL_VOLUME: 'UPDATE_CHANNEL_VOLUME',
  SET_CHANNEL_VOLUME: 'SET_CHANNEL_VOLUME',
  RESET_TRACKS: 'RESET_TRACKS',
}

export const addTrack = (instrumentName, instrumentType = 'synth') => ({
  type: actionType.ADD_TRACK,
  payload: instrumentName,
  instrumentType,
})

export const setChannelVolume = (index, instrumentId, volume) => ({
  type: actionType.SET_CHANNEL_VOLUME,
  payload: { index, volume },
  instrumentId,
})
