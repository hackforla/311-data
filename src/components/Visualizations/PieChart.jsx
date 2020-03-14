import React from 'react';
import PropTypes from 'proptypes';
import Chart from './Chart';

const PieChart = ({
  sectors,
  title,
  className,
  addLabels,
}) => {
  // // SET ORDER OF SECTORS ////
  // This weird code goes a long way towards ensuring that the sectors
  // of the pie chart alternate between big and small sectors, so that
  // the labels don't overlap each other. It's basically a hack around
  // the fact that ChartJS puts the sectors in alphabetical order by label.

  // sort sectors by value
  const sortedSectors = [...sectors].sort((a, b) => b.value - a.value);

  // construct sectors that alternate by size
  const altSectors = [];
  for (let i = 0; i < sectors.length; i += 1) {
    altSectors.push(sortedSectors.shift());
    sortedSectors.reverse();
  }

  // add a character to the beginning of each label to trick ChartJS
  for (let i = 0; i < altSectors.length; i += 1) {
    altSectors[i].label = String.fromCharCode(65 + i) + altSectors[i].label;
  }

  // // DATA ////

  const total = altSectors.reduce((p, c) => p + c.value, 0);

  const chartData = {
    labels: altSectors.map(el => el.label),
    datasets: [{
      data: altSectors.map(el => el.value),
      backgroundColor: altSectors.map(el => el.color),
      datalabels: {
        labels: {
          index: {
            align: 'end',
            anchor: 'end',
            formatter: (value, ctx) => {
              const { label } = altSectors[ctx.dataIndex];
              const percentage = (100 * (value / total)).toFixed(1);
              return addLabels
                ? `${label.substring(1)}\n${percentage}%`
                : `${percentage}%`;
            },
            offset: 4,
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
      callbacks: {
        label: (tt, data) => {
          const { index } = tt;
          const label = data.labels[index].substring(1);
          const value = data.datasets[0].data[index];
          return ` ${label}: ${value}`;
        },
      },
    },
  };

  return (
    <Chart
      title={title}
      type="pie"
      data={chartData}
      options={chartOptions}
      datalabels
      className={className}
    />
  );
};

export default PieChart;

PieChart.propTypes = {
  sectors: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string,
  })).isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  addLabels: PropTypes.bool,
};

PieChart.defaultProps = {
  title: null,
  className: undefined,
  addLabels: false,
};
