import React from 'react';
import { useLocation } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@material-ui/core';

const Reports = () => {
  const [isLoading, setIsLoading] = React.useState(true);

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
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100%',
        backgroundColor: 'black',
      }}
    >
      <Backdrop style={{ zIndex: 100 }} open={isLoading} invisible={!isLoading}>
        <CircularProgress />
      </Backdrop>
      <iframe
        title="reportFrame"
        src={url + reportPath}
        frameBorder="0"
        allowFullScreen
        style={{ width: '100%', height: '100%', minHeight: '55em' }}
      />
    </div>
  );
};

export default Reports;
