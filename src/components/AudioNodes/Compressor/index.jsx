import React, { useEffect } from 'react';
import { SliderWithLabel } from '../../Slider';
import { setToneSignalValue } from '../../../utils';
import Visualization from './Visualization';

export const Compressor = ({ preset, setEffect }) => (
    <>
      <Visualization preset={preset} />
      <SliderWithLabel
        onChange={setEffect('ratio')}
        label="Ratio" value={preset.get('ratio')}
        min={1}
        max={20}
        step={1}
      />
      <SliderWithLabel
        onChange={setEffect('threshold')}
        label="Threshold" value={preset.get('threshold')}
        min={-100}
        max={0}
        step={1}
      />
      <SliderWithLabel
        onChange={setEffect('attack')}
        label="Attack" value={preset.get('attack')}
        min={0.01}
        max={4}
        step={0.05}
      />
      <SliderWithLabel
        onChange={setEffect('release')}
        label="Release" value={preset.get('release')}
        min={0.01}
        max={4}
        step={0.05}
      />
      <SliderWithLabel
        onChange={setEffect('knee')}
        label="Knee" value={preset.get('knee')}
        min={0}
        max={40}
        step={1}
      />
    </>
);

export default Compressor;