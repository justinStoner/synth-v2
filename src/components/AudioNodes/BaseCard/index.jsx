import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, Typography } from '@material-ui/core';

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
});

const BaseCard = ({ label, classes, children, headerComponent }) => (
  <Grid item xs={12} md={4} lg={3}>
    <Paper className={classes.paper}>
      <div>
        <Typography variant="subtitle1" style={headerComponent ? { display: 'inline' } : undefined}>{label}</Typography>
        {headerComponent}
      </div>
      {children}
    </Paper>
  </Grid>
);

export default withStyles(styles)(React.memo(BaseCard));

export const SelectComponent = ({ classes, label, value, onChange = () => {}, items = [], inputStyles, labelStyles }) => (
  <TextField
    select
    label={label}
    className={classes.textField}
    value={value}
    onChange={onChange}
    SelectProps={{ classes }}
    InputProps={{ style: inputStyles }}
    InputLabelProps={{ styles: labelStyles }}
  >
    {items.map(item => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ))}
  </TextField>
);

const fullWidthSelectStyles = theme => ({
  textField: {
    margin: `${theme.spacing(1)}px 0`,
    marginTop: 0,
  },
});

export const FullWidthSelect = withStyles(fullWidthSelectStyles)(SelectComponent);


const headerSelectStyles = theme => ({
  textField: {
    margin: 0,
    float: 'right',
  },
  select: {
    paddingBottom: 0,
  },
});

export const HeaderSelect = withStyles(headerSelectStyles)(SelectComponent);

export const SmallSelectComponent = ({ classes, label, value, onChange = () => {}, items = [], inputStyles, labelStyles }) => (
  <TextField
    select
    label={label}
    className={classes.textField}
    value={value}
    onChange={onChange}
    SelectProps={{ classes }}
    InputProps={{ style: {
      display: 'inline',
      margin: 0,
      transform: 'scale(0.75)',
      maxWidth: '80px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } }}
    InputLabelProps={{ style: {
      display: 'inline',
      position: 'relative',
      paddingTop: 2,
    } }}
  >
    {items.map(item => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ))}
  </TextField>
);

const smallSelectStyles = theme => ({
  textField: {
    margin: 0,
    marginLeft: '10%',
    flexDirection: 'row',
  },
  select: {
    paddingBottom: 0,
    fontSize: 16,
    transform: 'translate(0, 1.5px) scale(0.75)',
    color: theme.palette.text.secondary,
    display: 'inline',
    margin: 0,
  },
  input: {
    root: {
      display: 'inline',
      margin: 0,
    },
  },
  label: {
    root: {
      display: 'inline',
      position: 'relative',
    },
  },
})

export const SmallSelect = withStyles(smallSelectStyles)(SmallSelectComponent)