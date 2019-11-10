import { Seq } from 'immutable';
import Tone from 'tone';
import { Sample } from '../context/AudioContext';

export function fromJSOrdered(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ?
      Seq(js).map(fromJSOrdered).toList() :
      Seq(js).map(fromJSOrdered).toOrderedMap();
}

export const setToneValue = (node, value, valueName) => {
  node[valueName] = value
}

export const setToneSignalValue = (node, value, valueName) => {
  node[valueName].value = value
}

export const calculateMeasure = (stepIndex, SPB) => Math.floor((stepIndex) / SPB);

export const calculateStep = (stepIndex, SPB) => Math.floor((stepIndex) % SPB);

export const calculateSampleDuration = (SPB, { start = 1, end = 2, stepStart = 1, stepEnd = 2 }) =>
  Tone.Ticks(Tone.Time(
    `${calculateMeasure(end, SPB)}:${calculateStep(stepEnd, SPB)}`
  ).toTicks() - Tone.Time(
    `${calculateMeasure(start, SPB)}:${calculateStep(stepStart, SPB)}`
  ).toTicks()).toNotation()

export const calculateTime = (start, step) => `${start -1}:${step}`

export const calculateStepIndex = (step, measure, SPB) => (step + (measure * SPB))

export const createSampleNote = ({ sampleId, title, note, index, SPB, start = 1, end = 2, stepStart = 1, stepEnd = 2, velocity = 1 }) => {
  const startMeasure = 1 + calculateMeasure(start, SPB);
  const endMeasure = 1 + calculateMeasure(end, SPB);
  const startStep = calculateStep(stepStart, SPB);
  const endStep = calculateStep(stepEnd, SPB);
  return new Sample({
    id: note,
    sampleId,
    row: note,
    key: title + calculateStepIndex(startStep, startMeasure, SPB) + calculateStepIndex(endStep, endMeasure, SPB),
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