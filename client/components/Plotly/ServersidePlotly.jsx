import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  serverPlot: {
    position: 'absolute',
    top: theme.header.height,
    bottom: theme.footer.height,
    left: 0,
    right: 0,
  },
  iframe: {
    border: 'none',
    minHeight: '100%',
    width: '100%',
  },
}))

const ServersidePlotly = () => {
  const classes = useStyles();
  const url = process.env.DASHBOARDS_URL;

  return (
    <div className={classes.serverPlot}>
      <iframe
        className={classes.iframe}
        src={url}
      />
    </div>
  )
};

export default ServersidePlotly;