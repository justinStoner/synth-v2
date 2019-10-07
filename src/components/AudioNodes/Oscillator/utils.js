export const buildToneOscillatorType = ({ sourceType, baseType, partialCount }) => `${sourceType === 'osc' ? '' : sourceType}${sourceType === oscillatorSourceTypes.pulse || sourceType === oscillatorSourceTypes.pwm ? '' : baseType}${!partialCount ? '' : partialCount}`;

export const convertOscillatorToToneOscillator = ({ baseType, sourceType, partialCount, ...rest }) => ({
  type: buildToneOscillatorType({ sourceType, baseType, partialCount }),
  ...rest,
});

export const oscillatorSourceTypes = {
  fm: 'fm',
  osc: 'osc',
  fat: 'fat',
  am: 'am',
  pulse: 'pulse',
  pwm: 'pwm',
}

export const oscillatorSourceTypesDisplayNames = Object.keys(oscillatorSourceTypes).map(key => ({ label: key === oscillatorSourceTypes.osc ? 'basic' : key, value: key }));

export const setPartialCount = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.type = buildToneOscillatorType(Object.assign({}, preset, { partialCount: value }));
}

export const setBaseType = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.type = buildToneOscillatorType(Object.assign({}, preset, { baseType: value }));
}

export const setSourceType = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.type = buildToneOscillatorType(Object.assign({}, preset, { sourceType: value }));
}

export const setModulationType = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.modulationType = value;
}

export const setHarmonicity = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.harmonicity.value = value;
}

export const setSpread = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.spread = value;
}

export const setCount = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.spread = value;
}

export const setWidth = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.width.value = value;
}

export const setModulationFrequency = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.modulationFrequency.value = value;
}

export const setModulationIndex = (oscillatorNode, value, valueName, preset) => {
  oscillatorNode.modulationIndex.value = value;
}