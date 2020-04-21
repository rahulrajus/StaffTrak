import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DailyInsight from './components/DailyInsight';
import DepartmentTable from './components/DepartmentTable';
import { useAuth } from '../context/auth';
import './css/Portal.css';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Portal(props) {
  const classes = useStyles();
  //get request made here to the database
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dateString, setDateString] = useState('today');
  const [tableData, setTableData] = useState([]);
  const [department, setDepartment] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { authTokens, setAuthTokens } = useAuth();
  const [isResponses, setIsResponses] = useState(true)

  useEffect(() => {
    document.title = 'StaffTrak';
    async function fetchData() {
      setLoading(true);
      const [departmentResponse, tableDataResponse] = await Promise.all([getDepartment(), getTableData()]);

      if (departmentResponse === 'AUTH ERROR' || tableDataResponse === 'AUTH ERROR') {
        setAuthError(true);
      } else {
        // daily insight
        const numCheckedIn = tableDataResponse.data.members.length;
        const total = departmentResponse.data.members.length;

        setDepartment(departmentResponse.data);
        setTableData(tableDataResponse.data.members);
        setSummary({ numCheckedIn, total });
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedDate]);

  const getDepartment = async () => {
    try {
      const url = `/department?id=${authTokens.departmentId}`;
      const response = await axios.get(url);
      return response;
    } catch (err) {
      return 'AUTH ERROR';
    }
  }

  const handleSwitch = () => {
    setIsResponses(!isResponses)
  }

  const getTableData = async () => {
    try {
      const adminId = authTokens._id;
      const dateString = selectedDate.toISOString();
      const url = `/members?administrator_id=${adminId}&date=${dateString}`;
      const response = await axios.get(url);
      return response;
    } catch (err) {
      return 'AUTH ERROR';
    }
  }

  if (authError) {
    setAuthTokens();
    return (
      <Redirect to='/' />
    )
  }

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <Box mx={12} my={8}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DailyInsight name={authTokens.firstName} numCheckedIn={summary.numCheckedIn} total={summary.total} dateString={dateString} />
        </Grid>
        <Grid item xs={6}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={!isResponses}
                  onChange={handleSwitch}
                  name="responses"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />}
              label={isResponses ? "Showing members who have responded" : "Showing members who have NOT responded"}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <DepartmentTable selectedDate={selectedDate} setSelectedDate={setSelectedDate} setDateString={setDateString} department={department} tableData={tableData} isResponses={isResponses} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Portal;