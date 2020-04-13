import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import DailyInsight from './components/DailyInsight';
import DepartmentTable from './components/DepartmentTable';
import { useAuth } from '../context/auth';
import './css/Portal.css';

function Portal(props) {
  //get request made here to the database
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [tableData, setTableData] = useState([]);
  const [department, setDepartment] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const { authTokens } = useAuth();

  useEffect(() => {
    document.title = 'StaffTrak';
    setLoading(true);
    getDepartment();
    getSummary();
    getTableData();
    setLoading(false);
  }, []);

  const getDepartment = () => {
    const url = `/department?id=${authTokens.departmentId}`;
    axios.get(url)
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getTableData = () => {
    const adminId = authTokens._id;
    const url = `/members?administrator_id=${adminId}&date=${selectedDate}`;
    axios.get(url)
      .then((response) => {
        setTableData(response.data.members);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const getSummary = () => {
    setSummary({ numCheckedIn: 25, total: 50 })
  }

  return (
    <Box mx={12} my={8}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DailyInsight name={authTokens.firstName} numCheckedIn={summary.numCheckedIn} total={summary.total} />
        </Grid>
        <Grid item xs={12}>
          <DepartmentTable selectedDate={selectedDate} setSelectedDate={setSelectedDate} departmentName={department.departmentName} tableData={tableData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Portal;