import 'core-js/modules/esnext.math.scale';
import 'core-js/modules/esnext.math.clamp';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { composeWithDevTools, devToolsEnhancer  } from 'redux-devtools-extension'
import { createStore, applyMiddleware  } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import appReducer from './store/appReducer';
import rootSaga from './store/rootSaga';

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
const middlewareEnhancer = applyMiddleware(...middlewares)

const enhancers = [middlewareEnhancer]
const composedEnhancers = composeWithDevTools(...enhancers)

const store = createStore(appReducer, composedEnhancers)

const persistor = persistStore(store, { enhancer: devToolsEnhancer({ name: 'persist' }) }, () => {console.log('persist finished')});

sagaMiddleware.run(rootSaga, persistor)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
