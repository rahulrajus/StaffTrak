import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import DailyInsight from './components/DailyInsight';
import DepartmentTable from './components/DepartmentTable';
import { useAuth } from '../context/auth';
import './css/Portal.css';

function Portal(props) {
  //get request made here to the database
  const [tableData, setTableData] = useState([]);
  const { setAuthTokens } = useAuth();

  useEffect(() => {
    document.title = 'StaffTrak';
  }, []);

  return (
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
  );
}

export default Portal;