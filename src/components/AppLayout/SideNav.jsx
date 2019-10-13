import React from 'react';
import clsx from 'clsx';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
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
import Meter from '../Visualizations/Meter';
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

function ListItemLink(props) {
  const { icon, secondary, to, textClassName } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        // With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
        // See https://github.com/ReactTraining/react-router/issues/6056
        <NavLink to={to} activeClassName="Mui-selected" {...itemProps} innerRef={ref} />
      )),
    [to],
  );

  return (
    <ListItem inset dense button component={renderLink}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText className={textClassName} secondary={secondary} />
    </ListItem>
  );
}

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
            <React.Fragment key={route.name}>
              <ListItem button key={route.name} onClick={() => {if (!route.getSubItems) history.push(route.route)}}>
                <ListItemIcon>
                  {route.icon}
                </ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItem>
              {
                route.subItems && route.subItems.map(item => (
                  <ListItemLink
                    icon={<Meter style={{ padding: '0px 6px' }} barWidth={9} input={item.id} height={14} width={14} />}
                    textClassName={classes.dense}
                    key={item.route}
                    secondary={item.name}
                    to={item.route}
                  />
                ))
              }
              { route.sideNavSection && <route.sideNavSection />}
            </React.Fragment>
          ))
        }
      </List>
    </Drawer>
  )
}

export default withAppLayoutContext(withRouter(withAudioContext(SideNav)));