import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/paper-dashboard.css";
import "./styles/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AdminLayout from "./layouts/Admin";

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
            <Redirect to="/admin/dashboard" />
        </Switch>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
