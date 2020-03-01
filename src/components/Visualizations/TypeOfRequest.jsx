import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import Chart from './Chart';

const TypeOfRequest = ({
  requestTypes,
}) => {
  // // DATA ////

  const randomSeries = (count, min, max) => Array.from({ length: count })
    .map(() => Math.round(Math.random() * (max - min) + min));

  const selectedTypes = REQUEST_TYPES.filter(el => requestTypes[el.type]);

  const data = randomSeries(selectedTypes.length, 0, 300);

  const total = data.reduce((p, c) => p + c, 0);

  const chartData = {
    labels: selectedTypes.map(t => t.abbrev),
    datasets: [{
      data,
      backgroundColor: selectedTypes.map(t => t.color),
      datalabels: {
        labels: {
          index: {
            align: 'end',
            anchor: 'end',
            formatter: value => {
              const percentage = (100 * (value / total)).toFixed(1);
              return `${percentage}%`;
            },
            offset: 12,
          },
        },
      },
    }],
  };

  // // OPTIONS ////

  const chartOptions = {
    aspectRatio: 0.8,
    animation: false,
    layout: {
      padding: {
        top: 5,
        bottom: 50,
        left: 0,
        right: 0,
      },
    },
  };

  if (chartData.labels.length === 0) return null;

  return (
    <div className="type-of-request">
      <h1 className="has-text-centered">
        Type of Request
      </h1>
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        datalabels
      />
    </div>
  );
};

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(TypeOfRequest);

TypeOfRequest.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
