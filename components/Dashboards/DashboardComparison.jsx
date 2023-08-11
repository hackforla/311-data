import React from 'react';
import { useSelector } from 'react-redux';
import ContentBody from '@components/common/ContentBody';
// import ddbh from '@utils/duckDbHelpers.js';
// import DbContext from '@db/DbContext';

const DashboardComparison = () => {
  const isMapLoading = useSelector(state => state.data.isMapLoading);

  if (isMapLoading) return null;

  // const { conn } = useContext(DbContext);
  return (
    <ContentBody>
      <h1>Welcome to the future of Dashboard Comparison</h1>
    </ContentBody>
  );
};

export default DashboardComparison;
