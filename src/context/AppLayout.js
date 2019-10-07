import React from 'react';
import withContextFactory from './withContextFactory';

const AppLayoutContext = React.createContext({
  open: true,
  setOpen: () => {},
  route: '/',
  setRoute: () => {},
  tab: '',
  setTab: () => {},
})

export default AppLayoutContext;

export const withAppLayoutContext = withContextFactory(AppLayoutContext, 'appLayoutContext');