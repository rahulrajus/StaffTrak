import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DailyInsight from './components/DailyInsight';
import DepartmentTable from './components/DepartmentTable';
import './css/Portal.css'
import { useAuth } from '../context/auth'
import logo from '../images/stafftrak-horizontal.png'


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor:"rgba(134, 138, 95, 0.05)",
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



function Portal(props) {
  //get request made here to the database
  const [tableData, setTableData] = useState([]);
  const classes = useStyles();
  const { setAuthTokens } = useAuth();

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

  return (
    <div>
      <Grid className={classes.root}>
        <Grid item xs={12}>
          <AppBar position="static" className={classes.backgroundRow}>
            <Toolbar>
              <span>
                <img class="logo" src={logo} height='15%' width='15%' ></img>
              </span>
       
              <Button color="inherit" onClick={logOut}>Logout</Button>
            </Toolbar>
          </AppBar>
        </Grid>
        <Box mx={12} my={8}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <DailyInsight />
            </Grid>
            <Grid item xs={12}>
              <DepartmentTable />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </div>
  );
}

export default Portal;