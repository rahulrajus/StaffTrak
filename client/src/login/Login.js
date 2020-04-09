import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Face from '@material-ui/icons/Face';
import Fingerprint from '@material-ui/icons/Fingerprint';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing.unit * 5,
  },
  padding: {
    padding: theme.spacing.unit
  }
}));

function Login(props) {
  const classes = useStyles();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    console.log("click")
    if (userName == "t@g.com" && password == "admin") {
      setAuthTokens({ name: "t@g.com", password: "123" })
      setLoggedIn(true)
    } else {
      setIsError(true)
    }

    setAuthTokens({ name: "t@g.com", password: "123" })
    setLoggedIn(true)

  }

  if (isLoggedIn) {
    return <Redirect to="/portal" />
  }

  return (
    <div>
      <Grid>
        <Grid item xs={12}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" align="center" className={classes.title}>
                Department Name
            </Typography>
            </Toolbar>
          </AppBar>
        </Grid>

        <Box my={20}>
          <Grid container justify="center">
            <Grid item xs={4}>
              <Grid container spacing={8} justify="center">
                <Grid item>
                  <Typography variant="h5" className={classes.title}>
                    Welcome to StaffTrak!
                  </Typography>
                </Grid>
              </Grid>
              <form onSubmit={postLogin}>
                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <Face />
                  </Grid>
                  <Grid item md={true} sm={true} xs={true}>
                    <TextField error={isError ? true : false} id="username" label="Email" type="email" onChange={e => { setUserName(e.target.value) }} fullWidth autoFocus required />
                  </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <Fingerprint />
                  </Grid>
                  <Grid item md={true} sm={true} xs={true}>
                    <TextField error={isError ? true : false} id="passport" label="Password" type="password" onChange={e => { setPassword(e.target.value) }} fullWidth required />
                  </Grid>
                </Grid>
                <Grid container alignItems="center" justify="flex-end">
                  <Grid item>
                    <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password?</Button>
                  </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }} flex-grow={1}>
                  <Button variant="contained" color="primary" type="submit" onClick={postLogin} style={{ textTransform: "none", display: "flex", flexGrow: 1 }}>Login</Button>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </div>
  );
}

export default Login;
