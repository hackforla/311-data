import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import Chart from '@components/Chart';
import ChartExportSelect from '@components/export/ChartExportSelect';

const Frequency = ({
  frequency: { bins, counts },
}) => {
  if (!bins || !counts) return null;

  /* /// DATA /// */

  const chartData = {
    labels: bins.slice(0, -1).map(bin => moment(bin).format('MMM D')),
    datasets: Object.keys(counts).map(key => {
      const requestType = REQUEST_TYPES[key];
      return {
        data: counts[key],
        label: requestType?.abbrev,
        backgroundColor: requestType?.color,
        borderColor: requestType?.color,
        fill: false,
        lineTension: 0.3,
      };
    }),
  };

  /* /// EXPORT /// */

  const exportData = () => ({
    header: bins.slice(0, -1).map(bin => moment(bin).format('MM/DD/YYYY')),
    rows: chartData.datasets.map(dataset => dataset.data),
    index: chartData.datasets.map(dataset => dataset.label),
  });

  const exportButton = (
    <ChartExportSelect
      componentName="Frequency"
      pdfTemplateName="VisPage"
      exportData={exportData}
      filename="Frequency"
    />
  );

  /* /// OPTIONS /// */

  const chartOptions = {
    aspectRatio: 11 / 8,
    scales: {
      xAxes: [{
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
      callbacks: {
        title: tt => {
          const { index } = tt[0];
          const start = moment(bins[index]).format('MMM D');
          const end = moment(bins[index + 1]).subtract(1, 'days').format('MMM D');
          return start === end ? start : `${start} - ${end}`;
        },
      },
    },
  };

  return (
    <Chart
      title="Frequency"
      titleInfo="Frequency displays the number of specific request type(s) over time."
      type="line"
      data={chartData}
      options={chartOptions}
      exportButton={exportButton}
    />
  );
};

const mapStateToProps = state => ({
  frequency: state.data.frequency,
});

export default connect(mapStateToProps)(Frequency);

Frequency.propTypes = {
  frequency: PropTypes.shape({
    bins: PropTypes.arrayOf(PropTypes.string),
    counts: PropTypes.shape({}),
  }).isRequired,
};
