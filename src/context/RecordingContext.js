import React from 'react';
import withContextFactory from './withContextFactory';

const RecordingContext = React.createContext({
  selectedSample: undefined,
  selectedTrack: undefined,
});

export default RecordingContext;

export const withRecordingContext = withContextFactory(RecordingContext, 'recordingContext');