import React from 'react';
import BarChartIcon from '@material-ui/icons/BarChart';
import Audiotrack from '@material-ui/icons/Audiotrack';
import Synth from './containers/Synth';
import Recording from './containers/Recording';
import HeaderControls from './containers/Recording/HeaderControls'

export default [
  {
    header: 'Synthesizers',
    getSubItems: ({ instruments, path }) => instruments.entrySeq().map(([k, v]) => ({
      name: v.get('name'),
      path: `/synth/${k}`,
      id: v.get('id'),
    })).toJS(),
    subItems: [
      {
        name: 'Amplitude modulation',
        route: '/synth/AMSynth',
        id: 'AMSynth',
      },
      {
        name: 'Frequency modulation',
        route: '/synth/FMSynth',
        id: 'FMSynth',
      },
      {
        name: 'Pluck Synth',
        route: '/synth/PluckSynth',
        id: 'PluckSynth',
      },
      {
        name: 'Duo Synth',
        route: '/synth/DuoSynth',
        id: 'DuoSynth',
      },
    ],
    getHeader: ({ audioContext, path, id }) => audioContext.instruments.getIn([id, 'displayName']) || 'Synth',
    name: 'Synthesizers',
    route: '/synth',
    icon: <BarChartIcon />,
    component: Synth,
    exact: false,
    tabs: [{ label: 'Instrument', route: '/instrument' }, { label: 'Effects', route: '/effects' }],
  },
  {
    header: 'Tracks',
    name: 'Tracks',
    route: '/tracks',
    component: Recording,
    toolbarComponent: HeaderControls,
    exact: false,
    icon: <Audiotrack />,
  },
];
