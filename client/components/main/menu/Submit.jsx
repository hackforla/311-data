import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';
import { useLocation } from 'react-router-dom';
import { getDataRequest } from '@reducers/data';
import { getComparisonDataRequest } from '@reducers/comparisonData';
import Button from '@components/common/Button';

const Submit = ({
  getData,
  getComparisonData,
  filters,
  comparisonFilters,
}) => {
  const { pathname } = useLocation();
  const [disableSubmit, setDisableSubmit] = useState(true);

  const handleSubmit = () => {
    switch (pathname) {
      case '/data': {
        const {
          startDate,
          endDate,
          councils,
          requestTypes,
        } = filters;

        if (startDate
          && endDate
          && councils.length > 0
          && Object.values(requestTypes).includes(true)) {
            return getData();
        } else {
          if(!endDate){
            
          } else if(councils.length < 1){

          } else if(!(Object.values(requestTypes).includes(true))){

          }
        }
        break;
      }
      case '/comparison': return getComparisonData();
      default: return null;
    }
  };

  useEffect(() => {
    switch (pathname) {
      case '/data': {
        const {
          startDate,
          endDate,
          councils,
          requestTypes,
        } = filters;

        if (startDate
            && endDate
            && councils.length > 0
            && Object.values(requestTypes).includes(true)) {
          setDisableSubmit(false);
        } else {
          setDisableSubmit(true);
        }
        break;
      }
      case '/comparison': {
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

        if (startDate
            && endDate
            && chart
            && set1.district
            && set1.list.length > 0
            && set2.district
            && set2.list.length > 0
            && Object.values(requestTypes).includes(true)) {
          setDisableSubmit(false);
        } else {
          setDisableSubmit(true);
        }
        break;
      }
      default: return undefined;
    }

    return () => {};
  }, [disableSubmit, filters, comparisonFilters, pathname]);

  return (
    <div className="level" style={{ padding: '25px 192px 15px' }}>
      <div className="level-item">
        <Button
          id="sidebar-submit-button"
          label="Submit"
          handleClick={handleSubmit}
          disabled={disableSubmit}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
