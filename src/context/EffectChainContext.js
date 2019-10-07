import React from 'react';
import withContextFactory from './withContextFactory';
import { List } from 'immutable';

const EffectChainContext = React.createContext({
  inputNode: undefined,
  outputNode: undefined,
  effectChain: new List([]),
  setEffect: () => {},
  addEffect: () => {},
  removeEffect: () => {},
});

export default EffectChainContext;

export const withEffectContext = withContextFactory(EffectChainContext, 'effectChainContext');