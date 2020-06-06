import React, { useEffect } from 'react';
import { waveFormsDropdownItems } from '../../../utils/waveforms';
import { FullWidthSelect } from '../BaseCard';
import { SliderWithLabel } from '../../Slider';
import { setToneSignalValue, setToneValue } from '../../../utils';

export const setType = (node, value) => {
  node.type = value;
}

export const Chorus = ({ preset, setEffect }) => {
  console.log();
  return (
    <>
      <SliderWithLabel
        onChange={setEffect('frequency', setToneSignalValue)}
        label="Frequency" value={preset.get('frequency')}
        min={0.01}
        max={10}
        step={0.05}
      />
      <SliderWithLabel
        onChange={setEffect('delayTime', setToneValue)}
        label="Delay time" value={preset.get('delayTime')}
        min={1}
        max={100}
        step={1}
      />
      <SliderWithLabel
        onChange={setEffect('depth', setToneValue)}
        label="Depth" value={preset.get('depth')}
        min={0.01}
        max={1}
        step={0.05}
      />
      <FullWidthSelect
        items={waveFormsDropdownItems}
        label="Type" value={preset.get('type')}
        onChange={setEffect('type', setToneValue)}
      />
      <SliderWithLabel
        onChange={setEffect('spread', setToneValue)}
        label="Spread" value={preset.get('spread')}
        min={0}
        max={360}
        step={1}
      />
    </>
  )
};

export default Chorus;