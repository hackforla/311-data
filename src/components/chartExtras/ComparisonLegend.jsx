import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { DISTRICT_TYPES } from '@components/common/CONSTANTS';

const ComparisonLegend = ({
  set1,
  set2,
}) => {
  const legendItem = set => {
    if (!set.district) return null;

    const { color, name } = DISTRICT_TYPES.find(t => set.district === t.id);

    return (
      <div className="legend-item">
        <span className="color-swatch" style={{ backgroundColor: color }} />
        <span className="district-name">
          { name.replace(' District', '') }
        </span>
      </div>
    );
  };

  return (
    <div className="chart-extra comparison-legend">
      <h1>Legend</h1>
      <div className="outline">
        { legendItem(set1) }
        { legendItem(set2) }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  set1: state.comparisonFilters.comparison.set1,
  set2: state.comparisonFilters.comparison.set2,
});

export default connect(mapStateToProps)(ComparisonLegend);

ComparisonLegend.propTypes = {
  set1: PropTypes.shape({
    district: PropTypes.string,
  }).isRequired,
  set2: PropTypes.shape({
    district: PropTypes.string,
  }).isRequired,
};
