import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import Portal from './portal/Portal';
import Login from './login/Login';
import ResetPassword from './resetPassword/ResetPassword';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/auth';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import './App.css';
import logo from './images/stafftrak-horizontal.png';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "rgba(134, 138, 95, 0.03)",
    flexGrow: 1,
    height: "100vh"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  backgroundRow: {
    backgroundColor: "rgba(61,70,76,0.9)",
  }
}));

function App(props) {
  const [authTokens, setAuthTokens] = useState(JSON.parse(localStorage.getItem('userToken')));
  const classes = useStyles();

  const setTokens = (data) => {
    if (!data) {
      localStorage.removeItem("userToken");
    } else {
      localStorage.setItem("userToken", JSON.stringify(data));
    }
    setAuthTokens(data);
  }

  const theme = createMuiTheme({
    typography: {
      "fontFamily": ['Open Sans', "sans-serif"],
      "fontSize": 16,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
    }
  });

  function logOut() {
    axios.get('/logout')
      .then(
        (response) => {
          if (!response.data.authenticated) {
            setAuthTokens();
          } else {
            console.log('error logging out user');
          }
        },
      );
  }

  useEffect(() => {
    document.title = 'StaffTrak';
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <Grid className={classes.root}>
          <Grid item xs={12}>
            <AppBar position="static" className={classes.backgroundRow}>
              <Toolbar>
                <span>
                  <img src={logo} height='15%' width='15%'></img>
                </span>
                {authTokens !== null && authTokens !== undefined ?
                  <Button color="inherit" onClick={logOut}>Logout</Button> : null}
              </Toolbar>
            </AppBar>
          </Grid>
          <Switch>
            <Route exact path='/' component={Login} />
            <PrivateRoute exact path='/reset/:resetToken' component={ResetPassword} />
            <PrivateRoute path='/portal' component={Portal} />
            <Redirect from='/logout' to='/' />
          </Switch>
        </Grid>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default withRouter(App);
