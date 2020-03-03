import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import moment from 'moment';
import Chart from './Chart';
import Tooltip, { adapter } from './ChartTooltip';

const Frequency = ({
  requestTypes,
}) => {
  // // DATA ////

  const randomPoints = (count, min, max) => Array.from({ length: count })
    .map((el, idx) => ({
      x: moment().add(idx, 'd').toDate(),
      y: Math.round(Math.random() * (max - min) + min),
    }));

  const dummyData = REQUEST_TYPES.reduce((p, c) => {
    const acc = p;
    acc[c.type] = randomPoints(10, 20, 200);
    return acc;
  }, {});

  const selectedTypes = REQUEST_TYPES.filter(el => requestTypes[el.type]);

  const chartData = {
    datasets: selectedTypes.map(t => ({
      label: t.abbrev,
      backgroundColor: t.color,
      borderColor: t.color,
      fill: false,
      lineTension: 0,
      data: dummyData[t.type],
    })),
  };

  // // OPTIONS ////

  const chartOptions = {
    aspectRatio: 611 / 400,
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
      }],
    },
    tooltips: {
      custom: adapter(ttData => {
        const [abbrev, requests] = ttData.body[0].lines[0].split(': ');
        const lines = [{
          text: abbrev,
          color: ttData.labelColors[0].backgroundColor,
          bold: true,
        }, {
          text: `${requests} requests`,
        }];
        return <Tooltip lines={lines} />;
      }),
    },
  };

  return (
    <Chart
      title="Frequency"
      type="line"
      data={chartData}
      options={chartOptions}
      className="frequency"
    />
  );
};

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(Frequency);

Frequency.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
