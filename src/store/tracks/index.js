import { Record } from 'immutable';

export const Track = new Record({
  volume: 0,
  pan: 0,
  id: 0,
  mute: false,
  solo: false,
  name: '',
  title: '',
  recording: false,
  audioData: null,
  instrumentId: null,
}, 'Track')

export const createTrack = ({ name, title, instrumentId, id }) => new Track({
  name,
  title,
  instrumentId,
  id,
})