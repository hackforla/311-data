/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { connect } from 'react-redux';

import Icon from '@components/common/Icon';
import HoverOverInfo from '@components/common/HoverOverInfo';
import { updateComparisonChart } from '@reducers/filters';

const DistrictSelector = ({
  updateChart,
}) => {
  const labelStyle = { marginLeft: '1em' };
  const inputStyle = { marginRight: '0.5em' };

  const onChartSelect = chart => {
    updateChart(chart);
  };

  return (
    <div className="container">
      <p className="is-size-6" style={{ padding: '15px 0' }}>
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
      </p>
      <div className="field">
        <div className="control">
          <div className="columns is-vcentered">
            <div className="column">
              <label className="radio" style={labelStyle}>
                <input
                  type="radio"
                  name="chart-selector"
                  style={inputStyle}
                  onClick={() => onChartSelect('frequency')}
                />
                Frequency Chart
              </label>
              <label className="radio" style={labelStyle}>
                <input
                  type="radio"
                  name="chart-selector"
                  style={inputStyle}
                  onClick={() => onChartSelect('request')}

                />
                Total Request Chart
              </label>
            </div>
            <div className="column">
              <label className="radio" style={labelStyle}>
                <input
                  type="radio"
                  name="chart-selector"
                  style={inputStyle}
                  onClick={() => onChartSelect('time')}

                />
                Time-to-Close Chart
              </label>
              <label className="radio" style={labelStyle}>
                <input
                  type="radio"
                  name="chart-selector"
                  style={inputStyle}
                  onClick={() => onChartSelect('contact')}
                />
                311 Contact Pie Chart
              </label>
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

export default connect(null, mapDispatchToProps)(DistrictSelector);
