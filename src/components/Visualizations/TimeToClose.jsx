import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import Chart from './Chart';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const TimeToClose = ({
  requestTypes,
}) => {

  //// DATA ////

  const randomSeries = (count, min, max) => {
    return Array.from({ length: count })
      .map(() => Math.random() * (max - min) + min);
  };

  const dummyData = REQUEST_TYPES.reduce((p, c) => {
    p[c.type] = randomSeries(8, 0, 11);
    return p;
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

  //// OPTIONS ////

  const chartOptions = {
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

  //// HEIGHT ////

  const chartHeight = numLabels => (
    numLabels > 0
      ? 100 + (numLabels * 40)
      : 0
  );

  return (
    <div className="time-to-close">
      <Chart
        type="horizontalBoxplot"
        data={chartData}
        options={chartOptions}
        height={chartHeight}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(TimeToClose);

TimeToClose.propTypes = {
  requestTypes: PropTypes.object.isRequired,
};
