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
      const getLastUpdatedSQL = 'select max(createddate) from requests_2025;';
      
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
