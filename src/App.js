import React, { useEffect } from 'react';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import { BrowserRouter as Router, Route, Switch, Redirect  } from 'react-router-dom';
import AppLayoutContext from './context/AppLayout';
import Header from './components/AppLayout/Header';
import SideNav from './components/AppLayout/SideNav';
import { AudioContextContainer } from './context/AudioContext'
import routes from './routes';
import 'react-virtualized/styles.css';
import { initializeAudio, selectAppInitialized } from './store/appReducer';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import AudioRoot from './audioComponents/AudioRoot';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red,
    primaryGradient: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

const Dashboard = ({ initializeAudio, appInitialized }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {initializeAudio()}, [])
  return (
    <MuiThemeProvider theme={theme}>
      <AppLayoutContext.Provider value={{ open, setOpen }}>
        <AudioContextContainer>
          <Router>
            <div className={classes.root}>
              <CssBaseline />
              <Header />
              {appInitialized && <SideNav />}
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                {
                  appInitialized ?
                    <>
                      <Switch>
                        {
                          routes.map(route => (
                            <Route exact={route.exact} key={route.name} path={route.route} component={route.component} />
                          ))
                        }
                        <Redirect to={routes[0].route} />
                      </Switch>
                      <AudioRoot />
                    </>
                    :
                    <CircularProgress />
                }
              </main>
            </div>
          </Router>
        </AudioContextContainer>
      </AppLayoutContext.Provider>
    </MuiThemeProvider>
  );
}

const stp = state => ({
  appInitialized: selectAppInitialized(state),
})

const mapDispatchToProps = dispatch => ({
  initializeAudio: () => dispatch(initializeAudio()),
})

export default connect(stp, mapDispatchToProps)(Dashboard);
