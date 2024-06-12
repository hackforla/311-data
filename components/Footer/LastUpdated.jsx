import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import DbContext from '@db/DbContext';
import ddbh from '@utils/duckDbHelpers.js';
import { isEmpty, toNonBreakingSpaces } from '@utils';

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
    const getLastUpdated = async () => {
      const getLastUpdatedSQL = 'select max(createddate) from requests_2024;';

      const lastUpdatedAsArrowTable = await conn.query(getLastUpdatedSQL);
      const results = ddbh.getTableData(lastUpdatedAsArrowTable);

      if (!isEmpty(results)) {
        const lastUpdatedValue = results[0];
        setLastUpdated(lastUpdatedValue);
      }
    };

    getLastUpdated();
  }, [conn]);

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
