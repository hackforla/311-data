import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import Chart from './Chart';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import moment from 'moment';

const Frequency = ({
  requestTypes,
}) => {

  //// DATA ////

  const randomPoints = (count, min, max) => {
    return Array.from({ length: count })
      .map((el, idx) => ({
        x: moment().add(idx, 'd').toDate(),
        y: Math.round(Math.random() * (max - min) + min)
      }));
  };

  const dummyData = REQUEST_TYPES.reduce((p, c) => {
    p[c.type] = randomPoints(10, 20, 200);
    return p;
  }, {});

  const selectedTypes = REQUEST_TYPES.filter(el => requestTypes[el.type]);

  const chartData = {
    datasets: selectedTypes.map(t => ({
      label: t.abbrev + ' requests',
      backgroundColor: t.color,
      borderColor: t.color,
      fill: false,
      lineTension: 0,
      data: dummyData[t.type],
    }))
  };

  //// OPTIONS ////

  const chartOptions = {
    aspectRatio: 0.7,
    title: {
      text: 'Frequency',
      fontSize: 20,
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day',
          round: 'day',
        },
        scaleLabel: {
          labelString: 'Timeline',
        },
        ticks: {
          minRotation: 45,
          maxRotation: 45,
        },
      }],
      yAxes: [{
        scaleLabel: {
          labelString: '# of Requests',
        },
        ticks: {
          beginAtZero: true,
        },
      }]
    },
    tooltips: {
      callbacks: {
        title: () => null,
      },
    },
  };

  if (chartData.datasets.length === 0)
    return null;

  return (
    <div className="frequency">
      <Chart
        type="line"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(Frequency);

Frequency.propTypes = {
  requestTypes: PropTypes.object.isRequired,
};
