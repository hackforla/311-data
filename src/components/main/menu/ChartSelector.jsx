/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';

import Icon from '@components/common/Icon';
import HoverOverInfo from '@components/common/HoverOverInfo';
import Checkbox from '@components/common/Checkbox';
import { updateComparisonChart } from '@reducers/comparisonFilters';

const ChartSelector = ({
  comparisonChart,
  updateChart,
}) => {
  const labelStyle = { margin: '0' };
  const onChartSelect = chart => {
    updateChart(chart);
  };

  return (
    <div className="container">
      <div className="is-size-6" style={{ padding: '15px 0' }}>
        <strong style={{ paddingRight: '10px' }}>
          Chart Selection
        </strong>
        <HoverOverInfo
          title="Chart Selection"
          text="This filter allows the user to select a chart for comparison."
        >
          <Icon
            id="chart-selector-info-icon"
            icon="info-circle"
            size="small"
          />
        </HoverOverInfo>
      </div>
      <div className="chart-selector field">
        <div className="control">
          <div className="columns is-vcentered">
            <div className="column">
              <div>
                <Checkbox
                  id="radio-chart-freq"
                  type="radio"
                  name="chart-selector"
                  size="small"
                  handleClick={() => onChartSelect('frequency')}
                  checked={comparisonChart === 'frequency'}
                  style={labelStyle}
                />
                Frequency Chart
              </div>
              <div>
                <Checkbox
                  id="radio-chart-request"
                  type="radio"
                  name="chart-selector"
                  size="small"
                  handleClick={() => onChartSelect('request')}
                  checked={comparisonChart === 'request'}
                  style={labelStyle}
                />
                Total Request Chart
              </div>
            </div>
            <div className="column">
              <div>
                <Checkbox
                  id="radio-chart-time"
                  type="radio"
                  name="chart-selector"
                  size="small"
                  handleClick={() => onChartSelect('time')}
                  checked={comparisonChart === 'time'}
                  style={labelStyle}
                />
                Time-to-Close Chart
              </div>
              <div>
                <Checkbox
                  id="radio-chart-contact"
                  type="radio"
                  name="chart-selector"
                  size="small"
                  handleClick={() => onChartSelect('contact')}
                  checked={comparisonChart === 'contact'}
                  style={labelStyle}
                />
                311 Contact Pie Chart
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  updateChart: chart => dispatch(updateComparisonChart(chart)),
});

const mapStateToProps = state => ({
  comparisonChart: state.comparisonFilters.comparison.chart,
});

ChartSelector.propTypes = {
  updateChart: PropTypes.func.isRequired,
  comparisonChart: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartSelector);
