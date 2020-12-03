import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';
import { useLocation } from 'react-router-dom';
import { getDataRequest } from '@reducers/data';
import { getComparisonDataRequest } from '@reducers/comparisonData';
import Button from '@components/common/Button';

const Submit = ({
  setCErrors,
  setDErrors,
  getData,
  getComparisonData,
  filters,
  comparisonFilters,
}) => {
  const { pathname } = useLocation();
  const validateDataForm = () => {
    const {
      startDate,
      endDate,
      councils,
      requestTypes,
    } = filters;

    const noStartDate = !startDate;
    const noEndDate = !endDate;
    const noCouncils = councils.length <= 0;
    const noRequestTypes = !(Object.values(requestTypes).includes(true));
    setDErrors(noStartDate, noEndDate, noCouncils, noRequestTypes);

    if (!noStartDate && !noEndDate && !noCouncils && !noRequestTypes) {
      return true;
    }
    return false;
  };

  const validateComparisonForm = () => {
    const {
      startDate,
      endDate,
      comparison: {
        chart,
        set1,
        set2,
      },
      requestTypes,
    } = comparisonFilters;

    const noStartDate = !startDate;
    const noEndDate = !endDate;
    const noChart = !chart;
    const noDistrictOneSet = set1.list.length === 0;
    const noDistrictTwoSet = set2.list.length === 0;
    const noRequestTypes = !(Object.values(requestTypes).includes(true));
    setCErrors(noStartDate, noEndDate, noChart, noDistrictOneSet, noDistrictTwoSet, noRequestTypes);

    if (!noStartDate && !noEndDate && !noChart
    && !noDistrictOneSet && !noDistrictTwoSet && !noRequestTypes) {
      return true;
    }

    return false;
  };

  const handleSubmit = () => {
    switch (pathname) {
      case '/data': {
        if (validateDataForm()) {
          return getData();
        }
        break;
      }
      case '/comparison': {
        if (validateComparisonForm()) {
          return getComparisonData();
        }
        break;
      }
      default: return false;
    }
    return null;
  };

  return (
    <div className="level" style={{ padding: '25px 192px 15px' }}>
      <div className="level-item">
        <Button
          id="sidebar-submit-button"
          label="Submit"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  filters: state.filters,
  comparisonFilters: state.comparisonFilters,
});

const mapDispatchToProps = dispatch => ({
  getData: () => dispatch(getDataRequest()),
  getComparisonData: () => dispatch(getComparisonDataRequest()),
});

Submit.propTypes = {
  setCErrors: propTypes.func,
  setDErrors: propTypes.func,
  getData: propTypes.func,
  getComparisonData: propTypes.func,
  filters: propTypes.shape({
    startDate: propTypes.string,
    endDate: propTypes.string,
    councils: propTypes.arrayOf(propTypes.string),
    requestTypes: propTypes.shape({}),
  }).isRequired,
  comparisonFilters: propTypes.shape({
    startDate: propTypes.string,
    endDate: propTypes.string,
    comparison: propTypes.shape({
      chart: propTypes.string,
      set1: propTypes.shape({
        district: propTypes.string,
        list: propTypes.arrayOf(propTypes.string),
      }),
      set2: propTypes.shape({
        district: propTypes.string,
        list: propTypes.arrayOf(propTypes.string),
      }),
    }),
    requestTypes: propTypes.shape({}),
  }).isRequired,
};

Submit.defaultProps = {
  getData: () => null,
  getComparisonData: () => null,
  setCErrors: () => null,
  setDErrors: () => null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
