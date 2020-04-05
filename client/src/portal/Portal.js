import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar' 
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DepartmentTable from './components/departmentTable/DepartmentTable'
import './css/Portal.css'

const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1,
    },
 
    

  }));

function Portal(){
    //get request made here to the database
    const [tableData, setTableData] = useState([]);
    const classes = useStyles();





    return (
        <div >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <AppBar position="static">
                            <Grid
                                justify="space-between"
                                container
                            >
                            <Typography variant="h6" className={classes.title} >
                                Department Name
                            </Typography>
                            
                            <AccountCircle className={classes.account}  />
                        

                            </Grid>

                    </AppBar>


                </Grid>
                <Grid item xs={12}>
                    <DepartmentTable />


                </Grid>










            </Grid>



        </div>
        




        
        

    );

}

export default Portal;