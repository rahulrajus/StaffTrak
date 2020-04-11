import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Portal from './portal/Portal';
import Login from './login/Login';
import ResetPassword from './resetPassword/ResetPassword';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';
import './App.css';

function App(props) {
  const [authTokens, setAuthTokens] = useState(JSON.parse(localStorage.getItem('userToken')));

  const setTokens = (data) => {
    if (!data) {
      localStorage.removeItem("userToken");
    } else {
      localStorage.setItem("userToken", JSON.stringify(data));
    }
    setAuthTokens(data);
  }

  useEffect(() => {
    document.title = 'StaffTrak';
  }, [])

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Switch>
        <Route exact path='/' component={Login} />
        <PrivateRoute exact path='/reset/:resetToken' component={ResetPassword} />
        <PrivateRoute path='/portal' component={Portal} />
        <Redirect from='/logout' to='/' />
      </Switch>
    </AuthContext.Provider>
  );
}

export default withRouter(App);
