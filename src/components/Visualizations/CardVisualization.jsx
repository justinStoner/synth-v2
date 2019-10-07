import React from 'react';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  container: {
    height: 60,
    background: 'transparent',
    borderBottom: `1px solid ${theme.palette.grey[600]}`,
    padding: `${theme.spacing(2)}px 0`,
    marginBottom: theme.spacing(1),
  },
});

class CardVisualization extends React.Component {
  render() {
    const { classes, children, style } = this.props;
    return (
      <div className={classes.container} style={style}>
        {children}
      </div>
    )
  }
}

export default withStyles(styles)(CardVisualization);