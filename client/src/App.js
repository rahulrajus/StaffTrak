import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import Portal from './portal/Portal';
import Login from './login/Login';
import './App.css';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';


function App(props) {
  const [authTokens, setAuthTokens] = useState();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  useEffect(() => {
    document.title = 'StaffTrak';
    getUser();
  }, [])

  const getUser = () => {
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Router>
        <Route exact path='/' component={Login} />
        <PrivateRoute path='/portal' component={Portal} />
      </Router>
    </AuthContext.Provider>

  );
}

export default withRouter(App);
