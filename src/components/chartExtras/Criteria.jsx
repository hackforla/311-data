import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import CollapsibleText from './CollapsibleText';

const Criteria = ({
  startDate,
  endDate,
  councils,
}) => {
  const dateText = startDate && endDate
    ? `From ${startDate} to ${endDate}`
    : 'No date range selected.';

  const councilsText = councils.length > 0
    ? (
      <CollapsibleText
        items={councils}
        maxShown={10}
        delimiter="; "
        buttonId="toggle-show-more"
      />
    )
    : 'No councils selected.';

  return (
    <div className="chart-extra criteria">
      <h1>Criteria</h1>
      <div className="outline">
        <div>
          <span className="criteria-type">
            Date Range
          </span>
          { dateText }
        </div>
        <div>
          <span className="criteria-type">
            Neighborhood Council District
          </span>
          { councilsText }
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
