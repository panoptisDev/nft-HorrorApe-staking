import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import 'sf-font';
import './App.css';
import ReactDom from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import Lottery from './Lottery'
import TokenSale from './TokenSale';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


ReactDom.render(
  <BrowserRouter>
  <Switch>
    <Route path='/' exact>
    <App />
    </Route>
    <Route path='/lottery'>
    <Lottery />
    </Route>
    <Route path='/ticket-sale'>
    <TokenSale />
    </Route>
  </Switch>
  </BrowserRouter>
, document.getElementById('root'))


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
