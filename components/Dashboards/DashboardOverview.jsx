/* eslint-disable */
import React, { useState, useEffect, useContext } from 'react';
import { getDbRequest, getDbRequestSuccess } from '@reducers/data';
import PropTypes from 'proptypes';
import { useSelector, useDispatch } from 'react-redux';
import ContentBody from '@components/common/ContentBody';
import QuadLayout from '@dashboards/layouts/QuadLayout';

import ddbh from '@utils/duckDbHelpers.js';
import DbContext from '@db/DbContext';

/* Ideally these Quadrants should be imported from widgets as standalone React components */
import TotalByDayOfWeek from '@dashboards/widgets/TotalByDayOfWeek';

const Quadrant2 = ({ data }) => <div>Total Requests by Source</div>;
const Quadrant3 = ({ data }) => (
  <div>Median Days to Close Tickets by Request</div>
);
const Quadrant4 = ({ data }) => <div>Division Fulfilling Requests</div>;

const DashboardOverview = () => {
  const dispatch = useDispatch();

  const [requestsData, setRequestsData] = useState([]);

  // TODO: Need isDataLoading state to indicate whether duckDb data is still loading
  const isDbLoading = useSelector((state) => state.data.isDbLoading);

  const { conn } = useContext(DbContext);

  useEffect(() => {
    /* Here is some boilerplate code to fetch data from duckdb */
    async function fetchRequests() {
      dispatch(getDbRequest());
      const requestsAsArrowTable = await conn.query(
        'select * from requests limit 10'
      );
      const requests = ddbh.getTableData(requestsAsArrowTable);

      setRequestsData(requests);
    }

    if (!isDbLoading) {
      fetchRequests();
      dispatch(getDbRequestSuccess());
    }
  }, [isDbLoading]);

  if (isDbLoading) return null;

  return (
    <ContentBody>
      <QuadLayout
        quadrant1={<TotalByDayOfWeek data={requestsData} />}
        quadrant2={<Quadrant2 data={requestsData} />}
        quadrant3={<Quadrant3 data={requestsData} />}
        quadrant4={<Quadrant4 data={requestsData} />}
      />
    </ContentBody>
  );
};

DashboardOverview.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

DashboardOverview.defaultProps = {
  data: [{}],
};

export default DashboardOverview;
