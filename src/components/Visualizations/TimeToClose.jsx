import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import Chart from './Chart';

const TimeToClose = ({
  timeToClose,
}) => {
  // // DATA ////

  const boxes = Object.keys(timeToClose).map(key => {
    const requestType = REQUEST_TYPES.find(t => t.type === key);
    return {
      abbrev: requestType?.abbrev,
      color: requestType?.color,
      stats: {
        ...timeToClose[key],
        outliers: [],
      },
    };
  });

  const chartData = {
    labels: boxes.map(b => b.abbrev),
    datasets: [{
      data: boxes.map(b => b.stats),
      backgroundColor: boxes.map(b => b.color),
      borderColor: '#000',
      borderWidth: 1,
      outlierColor: '#000',
    }],
  };

  if (chartData.labels.length === 0) chartData.labels = [''];

  // // OPTIONS ////

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Days',
        },
        ticks: {
          beginAtZero: true,
          maxStats: 'whiskerMax',
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
  timeToClose: state.data.timeToClose,
});

export default connect(mapStateToProps)(TimeToClose);

TimeToClose.propTypes = {
  timeToClose: PropTypes.shape({}).isRequired,
};
