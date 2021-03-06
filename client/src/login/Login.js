
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Face from '@material-ui/icons/Face';
import Fingerprint from '@material-ui/icons/Fingerprint';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  forgotPassword: {
    color: theme.palette.lightGrey,
    "&:hover": {
      textDecoration: "underline",
      backgroundColor: 'inherit',
    },
  },
  loginButton: {
    backgroundColor: theme.palette.teal,
    color: "white",
    "&:hover": {
      backgroundColor: "#0089959e !important"
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Login(props) {
  const classes = useStyles();
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { authTokens, setAuthTokens } = useAuth();

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const postLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('/login', {
      email: userName,
      password,
    })
      .then((response) => {
        setAuthTokens(response.data);
        setErrorMsg("");
        setLoading(false);
      })
      .catch((error) => {
        setIsError(true);
        setErrorMsg(error.response.data);
        setLoading(false);
      });
  }

  if (authTokens !== null && authTokens !== undefined) {
    if (authTokens.usingDefaultPassword) {
      const resetLink = `/reset/${authTokens.resetPasswordToken}`;
      return <Redirect to={resetLink} />
    }
    return <Redirect to="/portal" />
  }

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
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
                <Tooltip open={errorMsg === "Incorrect password."} title="Incorrect password." aria-label="incorrect password" arrow placement="right">
                  <TextField error={isError ? true : false} id="passport" label="Password" type="password" onChange={e => { setPassword(e.target.value) }} fullWidth required />
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container alignItems="center" justify="flex-end">
              <Grid item>
                <Button className={classes.forgotPassword} disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text">Forgot password?</Button>
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '10px' }} flex-grow={1}>
              <Button className={classes.loginButton} variant="contained" type="submit" style={{ textTransform: "none", display: "flex", flexGrow: 1 }}>Login</Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
