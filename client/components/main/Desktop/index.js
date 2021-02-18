import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import MapContainer from '@components/Map';
import FilterMenu from '@components/FilterMenu';
import PersistentDrawerLeft from '@components/LeftDrawer';

import Plotly from '@components/Plotly';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: theme.header.height,
    bottom: theme.footer.height,
    left: 0,
    right: 0,
  },
}));

const Desktop = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PersistentDrawerLeft />
      <MapContainer />
      {/* <Plotly /> */}
      <FilterMenu />
    </div>
  );
};

export default Desktop;
