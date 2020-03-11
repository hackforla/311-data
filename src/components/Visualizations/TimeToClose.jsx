import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import Chart from './Chart';

const TimeToClose = ({
  requestTypes,
}) => {
  // // DATA ////

  const randomSeries = (count, min, max) => Array.from({ length: count })
    .map(() => Math.random() * (max - min) + min);

  const dummyData = REQUEST_TYPES.reduce((p, c) => {
    const acc = p;
    acc[c.type] = randomSeries(8, 0, 11);
    return acc;
  }, {});

  const selectedTypes = REQUEST_TYPES.filter(el => requestTypes[el.type]);

  const chartData = {
    labels: selectedTypes.map(t => t.abbrev),
    datasets: [{
      data: selectedTypes.map(t => dummyData[t.type]),
      backgroundColor: selectedTypes.map(t => t.color),
      borderColor: '#000',
      borderWidth: 1,
    }],
  };

  if (chartData.labels.length === 0) chartData.labels = [''];

  // // OPTIONS ////

  const chartOptions = {
    maintainAspectRatio: false,
    title: {
      text: 'Time to Close',
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Days',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          coef: 0,
        },
      }],
      yAxes: [{
        scaleLabel: {
          labelString: 'Type of Request',
        },
      }],
    },
    tooltips: {
      callbacks: {
        title: () => null,
      },
    },
    tooltipDecimals: 1,
  };

  return (
    <Chart
      title="Time to Close"
      type="horizontalBoxplot"
      data={chartData}
      options={chartOptions}
      height={Math.max(160, 60 + (chartData.labels.length * 40))}
      className="time-to-close"
    />
  );
};

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(TimeToClose);

TimeToClose.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
