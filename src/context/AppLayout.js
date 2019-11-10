import React from 'react';
import withContextFactory from './withContextFactory';

const AppLayoutContext = React.createContext({
  open: false,
  setOpen: () => {},
  route: '/',
  setRoute: () => {},
  tab: '',
  setTab: () => {},
})

export default AppLayoutContext;

export const withAppLayoutContext = withContextFactory(AppLayoutContext, 'appLayoutContext');