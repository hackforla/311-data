import React from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: theme.header.height,
    bottom: theme.footer.height,
    left: 0,
    right: 0,
    paddingLeft: '25px',
  },
}))

const PlotlyClientside = ({
  data,
  layout
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Plot
        data={data}
        layout={layout}
      />
    </div>
  )
};

export default PlotlyClientside;