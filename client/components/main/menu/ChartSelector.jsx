/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';

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
                  label={<span className="is-hidden">Frequency Chart</span>}
                  ariaLabel="frequency chart"
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
                  label={<span className="is-hidden">Total Request Chart</span>}
                  ariaLabel="total request chart"
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
                  label={<span className="is-hidden">Time-to-Close Chart</span>}
                  ariaLabel="time-to-close chart"
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
                  label={<span className="is-hidden">311 Contact Pie Chart</span>}
                  ariaLabel="311 contact pie chart"
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
