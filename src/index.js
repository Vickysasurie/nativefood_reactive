import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'


// optional cofiguration
const options = {
    position: 'top center',
    timeout: 5000,
    offset: '30px',
    transition: 'scale'
  }

ReactDOM.render(

  <AlertProvider template={AlertTemplate} {...options}>
  <App />
</AlertProvider>,

document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
