import React from 'react';
import BarChartIcon from '@material-ui/icons/BarChart';
import Synth from './containers/Synth';

export default [
  {
    header: 'Synthesizers',
    getSubItems: ({ audioContext, path }) => audioContext.instruments.entrySeq().map(([k, v]) => ({
      name: v.get('name'),
      path: `/${k}`,
    })),
    subItems: [
      {
        name: 'Amplitude modulation',
        route: '/synth/amsynth',
      },
      {
        name: 'Frequency modulation',
        route: '/synth/fmsynth',
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
];
