import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { DISTRICT_TYPES, COMPARISON_SETS } from '@components/common/CONSTANTS';
import InfoTitle from '@components/common/InfoTitle';

const ComparisonLegend = ({
  comparison,
}) => {
  if (!comparison.chart) return null;

  const legendItem = setId => {
    const set = comparison[setId];

    if (!set.district) return null;

    const { name } = DISTRICT_TYPES.find(t => set.district === t.id);
    const { color, name: setName } = COMPARISON_SETS[setId];

    return (
      <div className="legend-item">
        <span className="color-swatch" style={{ backgroundColor: color }} />
        <span className="district-name">
          { name.replace(' District', ` (${setName})`) }
        </span>
      </div>
    );
  };

  return (
    <div className="chart-extra comparison-legend">
      <InfoTitle
        title="Legend"
        infoText="The legend shows the district sets selected by the user."
      />
      <div className="outline">
        { legendItem('set1') }
        { legendItem('set2') }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  comparison: state.comparisonFilters.comparison,
});

export default connect(mapStateToProps)(ComparisonLegend);

ComparisonLegend.propTypes = {
  comparison: PropTypes.shape({
    set1: PropTypes.shape({
      district: PropTypes.string,
      list: PropTypes.arrayOf(PropTypes.string),
    }),
    set2: PropTypes.shape({
      district: PropTypes.string,
      list: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    chart: PropTypes.string,
  }),
};

ComparisonLegend.defaultProps = {
  comparison: {},
};
