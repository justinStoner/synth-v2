import React, { useEffect } from 'react';
import { SliderWithLabel } from '../../Slider';
import { setToneSignalValue, setToneValue } from '../../../utils';

export const Delay = ({ preset, tone, setEffect }) => {
  console.log();
  return (
    <>
      <SliderWithLabel
        onChange={setEffect('delayTime', setToneSignalValue)}
        label="Delay time" value={preset.get('delayTime')}
        min={0.01}
        max={4}
        step={0.05}
      />
      <SliderWithLabel
        onChange={setEffect('feedback', setToneSignalValue)}
        label="Feedback" value={preset.get('feedback')}
        min={0.01}
        max={1}
        step={0.05}
      />
    </>
  )
};

export default Delay;