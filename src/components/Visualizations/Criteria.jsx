import React, { useState } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';

// if more than this, use the more/less toggle
const MAX_COUNCILS = 10;

const Criteria = ({
  startDate,
  endDate,
  councils,
}) => {
  const [showAll, setShowAll] = useState(false);

  const dateText = startDate && endDate
    ? `From ${startDate} to ${endDate}`
    : 'No date range selected.';

  const shownCouncils = showAll ? councils : councils.slice(0, MAX_COUNCILS);

  const councilsText = councils.length > 0
    ? shownCouncils.join('; ')
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
          { councils.length > MAX_COUNCILS && (
            <span>
              <span>{ showAll ? '' : '...' }</span>
              <button
                type="button"
                className="show-toggle"
                onClick={() => setShowAll(!showAll)}
              >
                { showAll ? '(show less)' : '(show more)' }
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
  councils: state.filters.councils,
});

export default connect(mapStateToProps)(Criteria);

Criteria.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  councils: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Criteria.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};
