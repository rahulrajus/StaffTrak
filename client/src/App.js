import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import Portal from './portal/Portal';
import Login from './login/Login';
import ResetPassword from './resetPassword/ResetPassword';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';
import CircularProgress from '@material-ui/core/CircularProgress';
import './App.css';

function App(props) {
  const [authTokens, setAuthTokens] = useState(localStorage.getItem('userToken'));

  const setTokens = (data) => {
    localStorage.setItem("userToken", JSON.stringify(data));
    setAuthTokens(data);
  }

  useEffect(() => {
    document.title = 'StaffTrak';
  }, [])

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <Route exact path='/' component={Login} />
        <PrivateRoute path='/portal' component={Portal} />
        <Route exact path='/reset' component={ResetPassword} />
        <Redirect from='/logout' to='/' />
      </Router>
    </AuthContext.Provider>
  );
}

export default withRouter(App);
