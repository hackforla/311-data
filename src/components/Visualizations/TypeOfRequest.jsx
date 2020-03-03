import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import Chart from './Chart';
import Tooltip, { adapter } from './ChartTooltip';

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
    aspectRatio: 1.0,
    animation: false,
    layout: {
      padding: 65,
    },
    tooltips: {
      custom: adapter(ttData => {
        const [abbrev, value] = ttData.body[0].lines[0].split(': ');
        const lines = [{
          text: abbrev,
          color: ttData.labelColors[0].backgroundColor,
          bold: true,
        }, {
          text: `${value} requests`,
        }];
        return <Tooltip lines={lines} />;
      }),
    },
  };

  return (
    <Chart
      title="Type of Request"
      type="pie"
      data={chartData}
      options={chartOptions}
      datalabels
      className="type-of-request"
    />
  );
};

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(TypeOfRequest);

TypeOfRequest.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
