import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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

function ResetPassword(props) {
  const classes = useStyles();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setAuthTokens } = useAuth();

  function postLogin() {
    if (userName == "t@g.com" && password == "admin") {
      setAuthTokens({ name: "t@g.com", password: "123" })
      setLoggedIn(true)
    } else {
      setIsError(true)
    }

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
              <Typography variant="h6" className={classes.title}>
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
                  <Typography variant="h5" align="center" className={classes.title}>
                    Welcome to StaffTrak!
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={4} justify="center">
                <Grid item>
                  <Typography variant="subtitle1" align="center" className={classes.title}>
                    Because this is your first time logging in, we require you to change your password for security reasons.
                  </Typography>
                </Grid>
              </Grid>
              <form onSubmit={postLogin}>
                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <Fingerprint />
                  </Grid>
                  <Grid item md={true} sm={true} xs={true}>
                    <TextField error={isError ? true : false} id="passport" label="New Password" type="password" onChange={e => { setPassword(e.target.value) }} fullWidth required />
                  </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                  <Grid item>
                    <Fingerprint />
                  </Grid>
                  <Grid item md={true} sm={true} xs={true}>
                    <TextField error={isError ? true : false} id="passport" label="Confirm New Password" type="password" onChange={e => { setConfirmPassword(e.target.value) }} fullWidth required />
                  </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '40px' }} flex-grow={1}>
                  <Button variant="contained" color="primary" type="submit" onClick={postLogin} style={{ textTransform: "none", display: "flex", flexGrow: 1 }}>Reset Password</Button>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </div>
  );
}

export default ResetPassword;
