import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import CollapsibleList from '@components/common/CollapsibleList';
import InfoTitle from '@components/common/InfoTitle';

const Criteria = ({
  startDate,
  endDate,
  councils,
}) => {
  const dateText = startDate && endDate
    ? `From ${startDate} to ${endDate}`
    : 'No date range selected.';

  return (
    <div className="chart-extra criteria">
      <InfoTitle
        title="Criteria"
        infoText="The legend displays the specific date range and neighborhood council(s) selected by the user."
      />
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
          <CollapsibleList
            items={councils}
            maxShown={10}
            delimiter="; "
            buttonId="toggle-show-more"
            ifEmpty="No councils selected."
          />
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
