import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';

const Criteria = ({
  startDate,
  endDate,
  councils,
}) => {
  const dateText = startDate && endDate
    ? `From ${startDate} to ${endDate}`
    : 'No date range selected.';

  const councilsText = councils.length > 0
    ? councils.join('; ')
    : 'No councils selected.';

  return (
    <div className="criteria">
      <h1 className="has-text-centered">Criteria</h1>
      <div className="outline">
        <div className="date-range">
          <span className="criteria-type has-text-weight-bold">
            Date Range
          </span>
          <span>{ dateText }</span>
        </div>
        <div className="council-districts">
          <span className="criteria-type has-text-weight-bold">
            Neighborhood Council District
          </span>
          <span>{ councilsText }</span>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  startDate: state.data.startDate,
  endDate: state.data.endDate,
  councils: state.data.councils,
});

export default connect(mapStateToProps)(Criteria);

Criteria.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  councils: PropTypes.array.isRequired,
};

Criteria.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};
