import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import DbContext from '@db/DbContext';
import ddbh from '@utils/duckDbHelpers.js';
import { isEmpty } from '@utils';

const useStyles = makeStyles(theme => ({
  lastUpdated: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.dark,
    lineHeight: theme.footer.height,
  },
}));

const LastUpdated = () => {
  const classes = useStyles();
  const [lastUpdated, setLastUpdated] = useState('');
  const { conn } = useContext(DbContext);

  useEffect(() => {
    const getLastUpdated = async () => {
      const getLastUpdatedSQL = 'select max(createddate) from requests;';

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
          Data last updated&nbsp;
          {moment(lastUpdated).format('MM/DD/YY')}
        </Typography>
      </div>
    )
  );
};

export default LastUpdated;
