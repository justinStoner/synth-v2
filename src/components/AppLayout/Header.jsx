import React from 'react';
import clsx from 'clsx';
import { Route, Switch } from 'react-router-dom';
import { __RouterContext as RouterContext } from 'react-router';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core';
import { drawerWidth } from './constants';
import { withAppLayoutContext } from '../../context/AppLayout';
import routes from '../../routes';
import { withAudioContext } from '../../context/AudioContext';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  indicator: {
    backgroundColor: 'white',
  },
  tabsRoot: {
    minHeight: 62,
  },
}))

const Header = ({ appLayoutContext, history, audioContext }) => {
  const classes = useStyles();
  const { open, setOpen } = appLayoutContext;
  return (
    <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={() => {setOpen(true)}}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        {routes.map(route => (
          <Route
            key={route.name}
            path={route.route}
            render={({ match, location, history }) => (
              <>
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                  <Switch>
                    {route.subItems.map(item => (
                      <Route key={item.route} path={item.route} render={() => (<div>{item.name}</div>)} />
                    ))}
                  </Switch>
                </Typography>
                {
                  route.tabs && <RouterContext.Consumer>
                    {({ location }) => (
                      <Tabs classes={{ indicator: classes.indicator, root: classes.tabsRoot }} value={location.pathname} onChange={(e, newValue) => {history.push(newValue)}}>
                        {route.tabs.map(tab => (
                          <Tab classes={{ root: classes.tabsRoot }} label={tab.label} value={`${location.pathname.substring(0, location.pathname.lastIndexOf('/'))}${tab.route}`} key={tab.label} />
                        ))}
                      </Tabs>)}
                  </RouterContext.Consumer>
                }
              </>
            )}
          />
        ))}
      </Toolbar>
    </AppBar>
  )
}

export default withAppLayoutContext(withAudioContext(Header));