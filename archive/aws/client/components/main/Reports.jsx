import React from 'react';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    height: `calc(100vh - ${theme.header.height} - ${theme.footer.height})`,
    width: '100vw',
  },
  backdrop: {
    position: 'absolute',
    top: theme.header.height,
    bottom: theme.footer.height,
    height: `calc(100vh - ${theme.header.height} - ${theme.footer.height})`,
  },
}));

const REPORTS_PATH = '/reports/';

const Reports = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const classes = useStyles();

  const url = process.env.REPORT_URL;
  const location = useLocation();
  const reportPath = location.pathname.slice(REPORTS_PATH.length - 1);
  const reportRef = React.useRef(reportPath);

  React.useEffect(() => {
    if (reportPath !== reportRef.current) {
      setIsLoading(true);
    }

    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
    reportRef.current = reportPath;

    return () => {
      // componentWillUnmount code goes here...
    };
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
      />
    </div>
  );
};

export default Reports;
