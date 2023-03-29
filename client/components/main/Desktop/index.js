import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import MapContainer from '@components/Map';
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

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
