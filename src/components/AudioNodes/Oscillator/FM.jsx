import React from 'react';
import { SliderWithLabel } from '../../Slider';
import { setModulationIndex  } from './utils';
import { AM } from './AM';

const FM = ({ preset, setValue }) => (
    <>
      <AM preset={preset} setValue={setValue} />
      <SliderWithLabel onChange={setValue('modulationIndex')} label="Modulation index" value={preset.get('modulationIndex')} min={0} max={40} step={1} />
    </>
);

export default FM;