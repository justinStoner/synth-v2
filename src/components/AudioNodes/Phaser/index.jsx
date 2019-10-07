import React, { useEffect } from 'react';
import Tone from 'tone';
import { SliderWithLabel } from '../../Slider';
import { setToneSignalValue, setToneValue } from '../../../utils';

const setFrequency = (node, value, _, preset, inputNode, outputNode, setTone) => {
  node.frequency.value = value;
  node._lfoL.sync()
  node._lfoR.sync()
}

export const Phaser = ({ preset, tone, setEffect, setTone, inputNode, outputNode }) => {
  const frequency = preset.get('frequency');
  const stages = preset.get('stages');
  return (
    <>
      <SliderWithLabel
        onChange={setEffect('frequency', setFrequency)}
        label="Frequency" value={frequency}
        min={0.1}
        max={10}
        step={0.1}
      />
      <SliderWithLabel
        onChange={setEffect('baseFrequency', setToneValue)}
        label="Base frequency" value={preset.get('baseFrequency')}
        min={10}
        max={3000}
        step={10}
      />
      <SliderWithLabel
        onChange={setEffect('octaves', setToneValue)}
        label="Octaves" value={preset.get('octaves')}
        min={0}
        max={100}
        step={1}
      />
      <SliderWithLabel
        onChange={setEffect('stages', setToneValue)}
        label="Stages" value={stages}
        min={0}
        max={10}
        step={1}
      />
      <SliderWithLabel
        onChange={setEffect('Q', setToneSignalValue)}
        label="Q" value={preset.get('Q')}
        min={0.01}
        max={50}
        step={1}
      />
    </>
  )
};

export default Phaser;