import axios from 'axios';
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fingerprint from '@material-ui/icons/Fingerprint';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  resetButton: {
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

function ResetPassword(props) {
  const classes = useStyles();
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { authTokens, setAuthTokens } = useAuth();

  const postReset = (e) => {
    e.preventDefault();

    const resetLink = `/reset/${props.match.params.resetToken}`

    axios.post(resetLink, {
      password,
      confirmPassword,
      resetPasswordToken: props.match.params.resetToken,
    })
      .then((response) => {
        setAuthTokens(response.data.admin);
        setErrorMsg("");
        setLoading(false);
      })
      .catch((error) => {
        setIsError(true);
        setErrorMsg(error.response.data.errors[0].msg);
        setLoading(false);
      });
  }

  if (authTokens !== null && authTokens !== undefined) {
    if (!authTokens.usingDefaultPassword) {
      return <Redirect to="/portal" />
    }
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
              <Typography variant="h5" align="center" className={classes.title}>
                Reset Password
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
          <form onSubmit={postReset}>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <Fingerprint />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <Tooltip open={errorMsg === "Password must be at least 6 characters long."} title={"Password must be at least 6 characters long."} aria-label="password error" arrow placement="right">
                  <TextField error={isError ? true : false} id="password" label="New Password" type="password" onChange={e => { setPassword(e.target.value) }} fullWidth required />
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container spacing={8} alignItems="flex-end">
              <Grid item>
                <Fingerprint />
              </Grid>
              <Grid item md={true} sm={true} xs={true}>
                <Tooltip open={errorMsg === "Password confirmation is incorrect."} title={"Password confirmation is incorrect."} aria-label="password error" arrow placement="right">
                  <TextField error={isError ? true : false} id="confirm password" label="Confirm New Password" type="password" onChange={e => { setConfirmPassword(e.target.value) }} fullWidth required />
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container justify="center" style={{ marginTop: '40px' }} flex-grow={1}>
              <Button className={classes.resetButton} variant="contained" type="submit" style={{ textTransform: "none", display: "flex", flexGrow: 1 }}>Reset Password</Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ResetPassword;
