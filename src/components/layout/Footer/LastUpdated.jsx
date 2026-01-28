/*
  Component to show the date of the last data update in the footer which assumes data is available in conn from DbContext, 
  which is no longer a valid assumption if using Socrata or in new codebase structure
*/
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import DbContext from '@db/DbContext';
import ddbh from '@utils/duckDbHelpers.js';
import { isEmpty, toNonBreakingSpaces } from '@utils';

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE;

const useStyles = makeStyles(theme => ({
  lastUpdated: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.dark,
    lineHeight: theme.footer.height,
  },
}));

function LastUpdated() {
  const classes = useStyles();
  const [lastUpdated, setLastUpdated] = useState('');
  const { conn } = useContext(DbContext);

  useEffect(() => {
    if (DATA_SOURCE === 'SOCRATA') {
      setLastUpdated(Date.now()) 
    }
  },[DATA_SOURCE])

  useEffect(() => {
    const getLastUpdated = async () => {
      latestYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;  // this is the current month in integer form, with January == 1
      if (currentMonth < 4) {
        // The data is not made available until 2nd quarter of the year. Retrieve the last year's worth of data instead.
        latestYear -= 1;
      }
      const getLastUpdatedSQL = `select max(createddate) from requests_${year};`;
      
      const lastUpdatedAsArrowTable = await conn.query(getLastUpdatedSQL);
      const results = ddbh.getTableData(lastUpdatedAsArrowTable);
      
      if (!isEmpty(results)) {
        const lastUpdatedValue = results[0];
        setLastUpdated(lastUpdatedValue);
      }
    };
    
    if (DATA_SOURCE !== 'SOCRATA' && conn) {
      getLastUpdated();
    } 
  }, [conn, DATA_SOURCE]);

  return (
    lastUpdated && (
      <div>
        <Typography variant="body2" className={classes.lastUpdated}>
          {toNonBreakingSpaces(
            `Data last updated ${moment(lastUpdated).format('MM/DD/YY')}`
          )}
        </Typography>
      </div>
    )
  );
}

export default LastUpdated;
