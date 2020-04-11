import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {
  MuiPickersUtilsProvider, KeyboardDatePicker
} from '@material-ui/pickers';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import MomentUtils from '@date-io/moment';

function createData(time, name, exposedInLast24h, symptoms, temperature) {
  return { time, name, exposedInLast24h, symptoms, temperature };
}

const rows = [
  createData('12:00 PM', 'Member A', 'Yes', [], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('1:00 PM', 'Member B', 'No', [], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('1:00 PM', 'Member C', 'Yes', ['fever', 'chills'], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('2:00 PM', 'Member D', 'No', ['fever', 'chills'], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('9:00 AM', 'Member E', 'Yes', ['fever', 'chills'], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('6:00 AM', 'Member F', 'No', [], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('5:00 AM', 'Member G', 'Yes', ['cough'], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('10:00 PM', 'Member H', 'No', [], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('7:00 PM', 'Member I', 'Yes', ['cough'], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('12:00 AM', 'Member J', 'No', [], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
  createData('12:00 PM', 'Member K', 'No', [], [{ date: '3/13', temp: 95 }, { date: '3/14', temp: 95 }, { date: '3/15', temp: 97 }]),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'time', numeric: false, disablePadding: false, label: 'Last Check-in (Local Time)' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'exposedInLast24h', numeric: false, disablePadding: false, label: 'Exposed in Last 24h' },
  { id: 'symptoms', numeric: false, disablePadding: false, label: 'Symptoms List' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();

  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Responses
      </Typography>

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="ddd MMM Do"
          margin="normal"
          id="date-picker"
          label="Change date"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    </Toolbar>
  );
};

const useChipStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5)
    },
  },
}));

function SymptomChips(props) {
  const classes = useChipStyles();
  const { symptomsList } = props;

  return (
    <div className={classes.root}>
      {symptomsList.map((symptom, i) => (
        <Chip key={i} label={symptom} />
      ))}
    </div>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  redHighlight: {
    backgroundColor: 'rgba(245, 0, 87, 0.08)',
  },
  redHighlightHover: {
    backgroundColor: 'rgba(245, 0, 87, 0.)'
  },
  highlightHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper2: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #cecece',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function DepartmentTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('symptoms');
  const [open, setOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);

  const handleOpen = (name) => {
    let data = rows.filter(row => row.name === name);
    console.log(data[0].temperature);
    setGraphData(data[0].temperature);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    console.log("implement me later");
  };

  const shouldHighlight = (exposedInLast24h, symptoms) => {
    if (exposedInLast24h === 'Yes' || symptoms.length !== 0) {
      return true;
    }
    return false;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '45%' }} />
            </colgroup>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row, index) => {
                  const highlight = shouldHighlight(row.exposedInLast24h, row.symptoms);
                  const labelId = `enhanced-table-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                      selected={highlight}
                      onClick={() => handleOpen(row.name)}

                    >
                      <TableCell component="th" id={labelId}>
                        {row.time}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.exposedInLast24h}</TableCell>
                      <TableCell align="left">
                        <SymptomChips symptomsList={row.symptoms} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper2}>
              <Box mb={2}>
                <Typography variant="h6">Temperature over last 2 weeks</Typography>
              </Box>
              <LineChart width={600} height={300} data={graphData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="temp" stroke="#8884d8" strokeWidth={3} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis type="number" domain={['dataMin-4', 'dataMax+4']} />
                <Tooltip />
              </LineChart>
            </div>
          </Fade>
        </Modal>
      </Paper>
    </div >
  );
}