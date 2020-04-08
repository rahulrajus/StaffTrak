import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Portal from './portal/Portal';
import Home from './static/Home';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const PrivateRoute = ({
  component: Component, authed, loading, ...rest
}) => (
    <Route
      {...rest}
      render={(props) => {
        if (authed && !loading) {
          return <Component {...props} {...rest} />;
        }
        return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
      }
      }
    />
  );

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'StaffTrak';
    getUser();
  }, [])

  const getUser = () => {
    setLoading(false);
    setUserInfo({ test: 'test' });
    // setLoading(true);
    // axios.get('/api/whoami')
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
        <Route exact path='/' component={Home} />
        <Redirect from='/logout' to='/' />
        <PrivateRoute
          exact
          path='/portal'
          authed={userInfo !== null}
          loading={loading}
          userInfo={userInfo}
          component={Portal}
        />
      </Switch>
    </div>
  );
}

export default withRouter(App);
