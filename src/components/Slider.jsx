import React from 'react';
import Slider from '@material-ui/core/Slider';
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

export const SliderWithLabel = React.memo(({ label, smallDropdown, value, containerProps, labelStyles = {}, ...rest }) => (
  <div {...containerProps}>
    <InputLabel style={{ ...labelStyle, ...labelStyles }} shrink>{label}</InputLabel>
    {smallDropdown}
    <InputLabel className={classes.shrink} style={{ ...labelStyle, ...labelStyles, float: 'right' }} shrink>{value}</InputLabel>
    <StyledSlider {...rest} value={value}/>
  </div>
));