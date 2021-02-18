import React from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  clientPlot: {
    marginLeft: '500px',
    // width: '100%',
    // height: '100%',
  },
  serverPlot: {
    marginLeft: '500px',
    width: '100%',
    height: '100%',
  },
  iframe: {
    border: 'none',
  }
})

const Plotly = () => {
  const classes = useStyles();

  return (
    <>
      {/* <div className={classes.clientPlot}>
        <Plot
          data={[
            {
              x: [1, 2, 3],
              y: [2, 6, 3],
              type: 'scatter',
              mode: 'lines+markers',
              marker: {color: 'red'},
            },
            {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
          ]}
          layout={{width: 600, height: 300, title: 'A Fancy Plot'}}
        />
      </div> */}
      <div className={classes.serverPlot}>
          <iframe
            className={classes.iframe}
            src="https://dash-reporting.tofn9kh9mlm7g.us-east-1.cs.amazonlightsail.com/dashboards"
            width="100%"
            height="100%"
          />
      </div>
    </>
  )
};

export default Plotly;
