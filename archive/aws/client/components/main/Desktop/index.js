import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import MapContainer from '@components/Map';
import PropTypes from 'prop-types';
import PersistentDrawerLeft from '../shared/PersistentDrawerLeft';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: theme.header.height,
    bottom: theme.footer.height,
    left: 0,
    right: 0,
  },
}));

const Desktop = ({ initialState }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <PersistentDrawerLeft />
      <MapContainer
        initialState={initialState}
      />
    </div>
  );
};

export default Desktop;

Desktop.propTypes = {
  initialState: PropTypes.shape({
    councilId: PropTypes.string,
    rtId1: PropTypes.string,
    rtId2: PropTypes.string,
    rtId3: PropTypes.string,
    rtId4: PropTypes.string,
    rtId5: PropTypes.string,
    rtId6: PropTypes.string,
    rtId7: PropTypes.string,
    rtId8: PropTypes.string,
    rtId9: PropTypes.string,
    rtId10: PropTypes.string,
    rtId11: PropTypes.string,
    rtId12: PropTypes.string,
    requestStatusOpen: PropTypes.string,
    requestStatusClosed: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
};
