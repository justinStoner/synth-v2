import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))

const PageContainer = ({ children, maxWidth = 'lg' }) => {
  const classes = useStyles();
  return (
    <Container maxWidth={maxWidth} className={classes.container}>
      {children}
    </Container>
  )
}

export default PageContainer;