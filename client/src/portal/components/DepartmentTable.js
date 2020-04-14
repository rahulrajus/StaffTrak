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
import moment from 'moment';
import MomentUtils from '@date-io/moment';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function descendingTimeComparator(a, b, orderBy) {
  const timeA = moment(a.timeOfLastCheckIn)
  const timeB = moment(b.timeOfLastCheckIn)
  if (timeB.isBefore(timeA)) {
    return -1;
  }
  if (timeB.isAfter(timeA)) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  if (orderBy === 'time') {
    return order === 'desc'
      ? (a, b) => descendingTimeComparator(a, b, orderBy)
      : (a, b) => -descendingTimeComparator(a, b, orderBy);
  }
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

const EnhancedTableToolbar = ({ departmentName, selectedDate, setSelectedDate, setDateString }) => {
  const classes = useToolbarStyles();

  const handleDateChange = (date) => {
    const str = moment(date).calendar(null, {
      sameDay: '[today]',
      lastDay: '[yesterday]',
      lastWeek: '[last] dddd',
      sameElse: 'MMMM Do'
    });
    setDateString(str);
    setSelectedDate(date);
  };

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        {departmentName}
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
          maxDate={moment()}
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
  rowSymptoms: {
    backgroundColor: 'rgba(245, 0, 87, 0.1)',
    "&:hover": {
      backgroundColor: "rgba(254, 164, 159, 0.5) !important"
    },
    "&:selected": {
      backgroundColor: "rgba(254, 164, 159, 0.3) !important"
    },
  }
}));

export default function DepartmentTable({ selectedDate, setSelectedDate, setDateString, departmentName, tableData }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('symptoms');
  const [open, setOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);



  const handleOpen = (id) => {
    const member = tableData.find(row => row.member_id === id);
    const data = member.temperatures.map(temp => { return { 'date': moment(temp.date).format("M/D h:mma"), 'temp': temp.temp } });
    setGraphData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setGraphData([]);
    setOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && (order === 'asc');
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar departmentName={departmentName} selectedDate={selectedDate} setSelectedDate={setSelectedDate} setDateString={setDateString} />
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
              <col style={{ width: '20%' }} />
              <col style={{ width: '40%' }} />
            </colgroup>
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableData.length}
            />
            <TableBody>
              {stableSort(tableData, getComparator(order, orderBy))
                .map((row, index) => {
                  const labelId = `enhanced-table-${index}`;
                  const noSymptoms = row.symptoms.includes("I have no symptoms today") ? true : false;
                  const rowColor = noSymptoms && row.exposedInLast24h === "No" ? classes.rowNormal : classes.rowSymptoms;
                  const time = moment(row.timeOfLastCheckIn).format('LT');

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.member_id}
                      onClick={() => handleOpen(row.member_id)}
                      className={rowColor}
                    >
                      <TableCell component="th" id={labelId}>
                        {time}
                      </TableCell>
                      <TableCell align="left">{row.name.first + ' ' + row.name.last}</TableCell>
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
                <XAxis dataKey="date" hide={true} />
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