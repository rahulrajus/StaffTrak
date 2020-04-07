import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const DailyInsight = ({ data }) => {
  return (
    <div>
      <Typography variant="subtitle1">
        Welcome, John Doe
    </Typography>
      <Typography variant="body2">
        24 out of 50 members have checked in today.
    </Typography>
    </div>
  );
}

export default DailyInsight;