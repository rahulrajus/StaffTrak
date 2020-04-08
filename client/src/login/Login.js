import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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

function Login(props){
    const classes = useStyles();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthTokens } = useAuth()


    function postLogin(){
        console.log("click")
        setAuthTokens({name: "t@g.com", password: "123"})
        setLoggedIn(true)
    }

    if(isLoggedIn){
        return <Redirect to="/portal" />
    }



    return (
        <Paper >
       
            <Grid item xs={12}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Department Name
                    </Typography>
                    </Toolbar>
                </AppBar>
            </Grid>
            <div className={classes.margin}>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Face />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField id="username" label="Username" type="email" onChange={e => {setUserName(e.target.value)}} fullWidth autoFocus required />
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item>
                        <Fingerprint />
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField id="passport" label="Password" type="password" onChange={e => {setPassword(e.target.value)}}   fullWidth required />
                    </Grid>
                </Grid>
                <Grid container alignItems="center" justify="space-between">
             
                    <Grid item>
                        <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                    </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: '10px' }}>
                    <Button variant="outlined" color="primary" onClick={postLogin} style={{ textTransform: "none" }}>Login</Button>
                </Grid>
            </div>
        </Paper>
    );
}

export default Login;