import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import  { FirebaseContext } from './components/Firebase';
import SingletonFactory from './components/Firebase';


var firebase = SingletonFactory.getInstance();
var firebase2 = SingletonFactory.getInstance();
console.log(firebase === firebase2);

ReactDOM.render(
  <FirebaseContext.Provider value={firebase}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);
 
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();