import React from 'react';
import withContextFactory from './withContextFactory';

const InstrumentContext = React.createContext({
  audioNode: {},
  instrument: {},
  setInstrument: () => {},
});

export default InstrumentContext;

export const withInstrumentContext = withContextFactory(InstrumentContext, 'instrumentContext');

export const withPartialInstrumentContext = (Component, nameToMapTo) => withInstrumentContext(({ name, instrumentContext, ...rest }) => {
  const { instrument, setInstrument, audioNode, node: instrumentNode } = instrumentContext;
  const node = instrumentNode.voices[0][name];
  const partialContext = {
    [nameToMapTo]: {
      node,
      preset: instrument.preset[name],
      displayName: instrument.displayName,
    },
    setValue: (valueName, setToneInstrument, setExtraValues) => (event, value) => {
      const val = event.target.value || value;
      const extraValues = setExtraValues ? setExtraValues(instrument.preset.name, val) : {};
      console.log(val, setInstrument);
      setInstrument({ [name]: Object.assign({}, instrument.preset[name], { [valueName]: val, ...extraValues }) });
      // setToneInstrument && setToneInstrument(node, event.target.value || value, valueName, instrument.preset[name])
      instrumentNode.set({ [name]: { [valueName]: val } })
    },
    setInstrument,
    setPreset: params => setInstrument({ [name]: params }),
  };
  return (
    <Component {...partialContext}  {...rest} name={name} />
  )
});