import React, { useEffect } from 'react';
import { FullWidthSelect } from '../BaseCard';
import { SliderWithLabel } from '../../Slider';
import { setToneSignalValue, setToneValue } from '../../../utils';
import { filterDropdownItems } from './utils';
import Visualization from './Visualization';

export const setType = (node, value) => {
  node.type = value;
}

export const setToneRolloff = (node, value) => {
  //console.log(value * -1);
  node.rolloff = value * -1;
}

const marks = [
  {
    value: 12,
  },
  {
    value: 24,
  },
  {
    value: 48,
  },
  {
    value: 96,
  },
];

export const Filter = ({ preset, tone, setEffect }) => {
  console.log();
  const setRolloff = setEffect('rolloff');
  return (
    <>
      <Visualization filter={tone} preset={preset} />
      <SliderWithLabel
        onChange={setEffect('frequency', setToneSignalValue)}
        label="Frequency"
        value={preset.get('frequency')}
        min={1}
        max={20000}
        step={50}
      />
      <SliderWithLabel
        onChange={(e, newValue) => {setRolloff(null, newValue);setToneRolloff(tone, newValue)}}
        label="Rolloff"
        value={Math.abs(preset.get('rolloff'))}
        step={null}
        marks={marks}
      />
      <SliderWithLabel
        onChange={setEffect('Q', setToneSignalValue)}
        label="Q"
        value={preset.get('Q')}
        min={0.01}
        max={50}
        step={1}
      />
      <FullWidthSelect
        items={filterDropdownItems}
        label="Type"
        value={preset.get('type')}
        onChange={setEffect('type', setToneValue)}
      />
      <SliderWithLabel
        onChange={setEffect('gain', setToneSignalValue)}
        label="Gain"
        value={preset.get('gain')}
        min={-40}
        max={40}
        step={1}
      />
    </>
  )
};

export default Filter;