import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar' 
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

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
        
        

    );

}

export default Portal;