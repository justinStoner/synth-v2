import { Record, Map } from 'immutable';
import { calculateMeasure, calculateStep, calculateStepIndex, calculateTime, calculateSampleDuration } from '../../utils';
import { List } from '@material-ui/core';
import uuid from 'uuid/v4';

export const Clip = new Record({
  id: 0,
  clipId: 0,
  index: 0,
  row: 0,
  key: 0,
  title: 'item 1',
  start: 1,
  stepStart: 1,
  end: 4,
  stepEnd: 4,
  time: 0,
  endTime: 0,
  duration: 0,
  trackId: null,
  instrumentId: null,
  notes: Map(),
  velocity: 1,
  volume: 0,
}, 'Clip');

export const createClip = ({ instrumentId, trackId, title, notes = Map(), index, SPB, start = 1, end = 2, stepStart = 1, stepEnd = 2, velocity = 1 }) => {
  const startMeasure = 1 + calculateMeasure(start, SPB);
  const endMeasure = 1 + calculateMeasure(end, SPB);
  const startStep = calculateStep(stepStart, SPB);
  const endStep = calculateStep(stepEnd, SPB);
  return new Clip({
    id: trackId,
    trackId,
    row: trackId,
    key: uuid(),
    title,
    index,
    notes,
    start,
    end,
    instrumentId,
    stepStart,
    stepEnd,
    time: calculateTime(start, stepStart),
    endTime: calculateTime(end, stepEnd),
    velocity,
    duration: calculateSampleDuration(SPB, { start, end, stepStart, stepEnd }),
  })
}

export const createClipNote = ({ clipId, title, note, index, SPB, start = 1, end = 2, stepStart = 1, stepEnd = 2, velocity = 1 }) => {
  const startMeasure = 1 + calculateMeasure(start, SPB);
  const endMeasure = 1 + calculateMeasure(end, SPB);
  const startStep = calculateStep(stepStart, SPB);
  const endStep = calculateStep(stepEnd, SPB);
  return new Clip({
    id: note,
    clipId,
    row: note,
    key: uuid(),
    title,
    index,
    start: startMeasure,
    end: endMeasure,
    stepStart: startStep,
    stepEnd: endStep,
    time: calculateTime(startMeasure, startStep),
    endTime: calculateTime(endMeasure, endStep),
    velocity,
    duration: calculateSampleDuration(SPB, { start, end, stepStart, stepEnd }),
  })
}