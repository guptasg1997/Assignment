import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route , Redirect} from 'react-router-dom'
import { Provider } from 'react-redux'
import './App.css';

import Store from './redux/Store'
import Signup from './components/Signup'
import Login from './components/Login'
import Mailverify from './components/Mailverify'
import Forgotpass from './components/Forgotpass'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import Verify from './components/Verify'
import ChangePassword from './components/ChangePassword'
import 'bootstrap/dist/css/bootstrap.min.css'



function App() {
return (

  <Provider store = {Store} >
  <Router>
    <div className="App">
      <Switch>
        <Route path = '/dashboard' component = {Dashboard}/>
        <Route path = '/admin' component = {AdminDashboard}/>
        <Route path ='/signup' exact component ={Signup}/>
        <Route path = '/verifyreq' exact component = {Mailverify}/>
        <Route path = '/forgotpassword' exact component = {Forgotpass}/>
        <Route path = '/verify' exact component = {Verify}/>
        <Route path = '/changepassword' exact component = {ChangePassword}/>
        <Route path ='/' exact component ={Login}/>
        <Redirect to = "/"/>

       </Switch>
    </div>

  </Router>
  </Provider> 

    
  );
}

export default App;
