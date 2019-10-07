import React from 'react';
import clsx from 'clsx';
import { withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { drawerWidth } from './constants';
import { withAppLayoutContext } from '../../context/AppLayout';
import routes from '../../routes';
import { withAudioContext } from '../../context/AudioContext';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  dense: {
    fontSize: '0.875rem',
  },
}))

const SideNav = ({ appLayoutContext, history, match, audioContext }) => {
  const classes = useStyles();
  const { open, setOpen } = appLayoutContext;
  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={() => {setOpen(false)}}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {
          routes.map(route => (
            <>
            <ListItem button key={route.name} onClick={() => {if (!route.getSubItems) history.push(route.route)}}>
              <ListItemIcon>
                {route.icon}
              </ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItem>
            {
              route.subItems && route.subItems.map(item => (
                <ListItem dense inset button key={item.route}>
                  <ListItemText onClick={() => {history.push(item.route)}} className={classes.dense} inset secondary={item.name} />
                </ListItem>
              ))
            }
          </>
          ))
        }
      </List>
    </Drawer>
  )
}

export default withAppLayoutContext(withRouter(withAudioContext(SideNav)));