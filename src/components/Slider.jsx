import React from 'react';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { withStyles, InputLabel } from '@material-ui/core';
import { classes } from 'istanbul-lib-coverage';

const StyledSlider = withStyles(theme => ({
  root: {
    color: theme.palette.primary[500],
    height: 8,
  },
  thumb: {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -4,
    marginLeft: -6,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 4,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    borderRadius: 4,
  },
}))(Slider);

export default StyledSlider;

const labelStyle = { display: 'inline-block' };

function clamp(value, min, max) {
  if (!value || value === '' || value < min || isNaN(value) || value === undefined) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return Number(value);
}

export const SliderWithLabel = React.memo(({ label, smallDropdown, value, containerProps, labelStyles = {}, min, max, onChange, ...rest }) => (
  <div {...containerProps}>
    <InputLabel style={{ ...labelStyle, ...labelStyles }} shrink>{label}</InputLabel>
    {smallDropdown}
    <form
      style={{ display: 'inline' }}
      onSubmit={e => {
        e.preventDefault();
        const value = clamp(e.nativeEvent.target[0].value);
        console.log(value);
        onChange({ target: { value } }, value);
      }}
    >
      <Input
        className={classes.shrink}
        defaultValue={value}
        name="input"
        onBlur={({ target }) => {
          const value = clamp(target.value, min, max);
          onChange({ target: { value } }, value);
        }}
        inputProps={{ style: { paddingTop: 0, paddingBottom: 0, color: 'rgba(0, 0, 0, 0.54)' } }}
        style={{
          display: 'inline-flex',
          margin: 0,
          transform: 'scale(0.75)',
          maxWidth: '60px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flexDirection: 'row',
          fontSize: '1rem',
          verticalAlign: 'top',
          float: 'right',
        }}
      />
    </form>
    <StyledSlider min={min} max={max} onChange={onChange} {...rest} value={value}/>
  </div>
));
SliderWithLabel.displayName = 'SliderWithLabel';