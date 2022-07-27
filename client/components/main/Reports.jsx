/* eslint-disable react/self-closing-comp */
import React from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    height: `calc(100vh - ${theme.header.height} - ${theme.footer.height})`,
    width: '100vw',
    backgroundColor: 'black',
  },
  backdrop: {
    position: 'absolute',
    top: theme.header.height,
    bottom: theme.footer.height,
    height: `calc(100vh - ${theme.header.height} - ${theme.footer.height})`,
    backgroundColor: 'black',
  },
}));

const Reports = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const classes = useStyles();

  const url = process.env.REPORT_URL;
  let reportPath = '/dashboards/overview';
  const location = useLocation();
  reportPath = location.pathname.slice(8);
  const reportRef = React.useRef(reportPath);

  /* eslint-disable consistent-return */
  React.useEffect(() => {
    if (reportPath !== reportRef.current) {
      setIsLoading(true);
    }

    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
    reportRef.current = reportPath;
  }, [reportPath, isLoading]);

  return (
    <div
      className={classes.root}
    >
      <Backdrop
        className={classes.backdrop}
        style={{ zIndex: 100 }}
        open={isLoading}
        invisible={!isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <iframe
        title="reportFrame"
        src={url + reportPath}
        frameBorder="0"
        allowFullScreen
        style={{ width: '100%', height: '100%' }}
      >
      </iframe>
    </div>
  );
};

export default Reports;
