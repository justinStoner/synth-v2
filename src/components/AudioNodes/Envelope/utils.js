export const envelopeCurves = {
  linear: 'linear',
  exponential: 'exponential',
  sine: 'sine',
  cosine: 'cosine',
  bounce: 'bounce',
  ripple: 'ripple',
  step: 'step',
};

export const envelopeCurvesDisplayNames = Object.keys(envelopeCurves).map(key => ({ label: key, value: key }))

export const decayCurves = {
  [envelopeCurves.linear]: envelopeCurves.linear,
  [envelopeCurves.exponential]: envelopeCurves.exponential,
}

export const decayCurvesDisplayNames = Object.keys(decayCurves).map(key => ({ label: key, value: key }))