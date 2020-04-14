import React from 'react';
import Typography from '@material-ui/core/Typography';

const DailyInsight = ({ name, numCheckedIn, total, dateString }) => {
  return (
    <div>
      <Typography variant="subtitle1">
        {'Welcome, ' + name}
      </Typography>
      <Typography variant="body2">
        {numCheckedIn + ' out of ' + total + ' members checked in ' + dateString + '.'}
      </Typography>
    </div>
  );
}

export default DailyInsight;