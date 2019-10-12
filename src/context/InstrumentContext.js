import React from 'react';
import { Map } from 'immutable';
import withContextFactory from './withContextFactory';

const InstrumentContext = React.createContext({
  audioNode: {},
  instrument: {},
  updateInstrument: () => {},
});

export default InstrumentContext;

export const withInstrumentContext = withContextFactory(InstrumentContext, 'instrumentContext');

export const withPartialInstrumentContext = Component => withInstrumentContext(({ parent, name, instrumentContext, ...rest }) => {
  const { instrument, updateInstrument } = instrumentContext;
  const audioNode = instrument.get('audioNode');
  const node = audioNode.voices ?
    (parent ? audioNode.voices[0][parent][name] : audioNode.voices[0][name]) :
    audioNode[name];
  const presetPath = parent ? ['preset', parent, name] : ['preset', name]
  const partialContext = {
    audioNode: node,
    preset: instrument.getIn(presetPath),
    displayName: instrument.get('displayName'),
    setValue: (valueName, setToneInstrument, setExtraValues) => (event, value) => {
      const val = event.target.value || value;
      const extraValues = setExtraValues ? setExtraValues(instrument.preset.name, val) : {};
      updateInstrument(presetPath, Map({ [valueName]: val, ...extraValues }))
      // setToneInstrument && setToneInstrument(node, event.target.value || value, valueName, instrument.preset[name])
      const nodeValue = { [name]: { [valueName]: val } };
      audioNode.set(parent ? { [parent]: nodeValue } : nodeValue)
    },
    updateInstrument,
    setPreset: params => updateInstrument(presetPath, params),
  };
  return (
    <Component {...partialContext}  {...rest} name={name} />
  )
});