import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DailyInsight from './components/DailyInsight';
import DepartmentTable from './components/departmentTable/DepartmentTable';
import './css/Portal.css'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Portal() {
  //get request made here to the database
  const [tableData, setTableData] = useState([]);
  const classes = useStyles();

  return (
    <div >
      <Grid>
        <Grid item xs={12}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Department Name
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
        </Grid>
        <Box mx={12} my={8}>
          <Grid container direction="col" spacing={4}>
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