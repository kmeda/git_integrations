import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from '../src/components/App';
import './styles/main.scss';

import { AppStateReducer } from '../src/reducers/appState';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


export const store = 
createStore(
  combineReducers({
    appState: AppStateReducer
  }),
  compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f)
);


ReactDOM.render( 
  <Provider store={store}>
     <App />
  </Provider>, document.getElementById('root'));