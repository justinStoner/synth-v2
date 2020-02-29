export const actionType = {
  SAVE_SONG: 'SAVE_SONG',
  CREATE_SONG: 'CREATE_SONG',
  LOAD_SONG: 'LOAD_SONG',
  SET_SONG: 'SET_SONG',
}

export const saveSong = ({ name, id }) => ({
  type: actionType.SAVE_SONG,
  payload: { name, id },
});

export const loadSong = id => ({
  type: actionType.LOAD_SONG,
  payload: id,
})