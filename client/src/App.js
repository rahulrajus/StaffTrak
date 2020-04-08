import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Portal from './portal/Portal';
import Login from './login/Login';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const Auth = ({ component: Component, ...rest }) => {
  const counter = useSelector(state => state);
  return (
    <Route
      {...rest}
      render={props =>
        counter ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function App() {
  const [authed, setAuthed] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'StaffTrak';
    getUser();
  }, [])

  const getUser = () => {
    setLoading(false);
    setAuthed(true);
    // axios.get('localhost:80/whoami')
    //   .then(
    //     (response) => {
    //       const userObj = response.data;
    //       if (userObj._id !== undefined) {
    //         setUserInfo(userInfo);
    //         setLoading(false);
    //       } else {
    //         setUserInfo(null);
    //         setLoading(false);
    //       }
    //     },
    //   );
  }

  return (
    <div>
      <Switch>
        <Redirect from='/logout' to='/login' />
        <Route exact path='/login' component={Login} />
        {authed ? <Route exact path='/portal' component={Portal} userInfo={userInfo} /> : <Route exact path='/login' component={Login} />}
        {/* <PrivateRoute
          exact
          path='/portal'
          authed={authed}
          loading={loading}
          userInfo={userInfo}
          component={Portal}
        /> */}
      </Switch>
    </div>
  );
}

export default withRouter(App);
