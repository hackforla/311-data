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

const DASHBOARD_PATH = '/dashboard/';

const Dashboard = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const classes = useStyles();

  const url = process.env.REPORT_URL;
  const location = useLocation();
  const dashboardPath = location.pathname.slice(DASHBOARD_PATH.length - 1);
  const dashboardRef = React.useRef(dashboardPath);

  React.useEffect(() => {
    if (dashboardPath !== dashboardRef.current) {
      setIsLoading(true);
    }

    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
    dashboardRef.current = dashboardPath;

    return () => {
      // componentWillUnmount code goes here...
    };
  }, [dashboardPath, isLoading]);

  return (
    <div className={classes.root}>
      <Backdrop
        className={classes.backdrop}
        style={{ zIndex: 100 }}
        open={isLoading}
        invisible={!isLoading}
      >
        <CircularProgress />
      </Backdrop>
      <iframe
        title="dashboardFrame"
        src={url + dashboardPath}
        frameBorder="0"
        allowFullScreen
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Dashboard;
