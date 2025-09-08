/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';
import ChartJS from 'chart.js';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import { getColors } from '../mapColors';

class RequestsDonut extends React.Component {
  canvasRef = React.createRef();

  getRequestCounts = selectedRequests => {
    return Object.keys(REQUEST_TYPES).map(t => selectedRequests[t] || 0);
  };

  getSchemeColors = colorScheme => {
    const colors = getColors(colorScheme);
    return Object.keys(REQUEST_TYPES).map(t => colors[t]);
  };

  getLabels = () => {
    return Object.keys(REQUEST_TYPES).map(t => REQUEST_TYPES[t].displayName);
  };

  componentDidMount() {
    const { selectedRequests, colorScheme } = this.props;
    const ctx = this.canvasRef.current.getContext('2d');
    this.chart = new ChartJS(ctx, {
      type: 'doughnut',
      aspectRatio: 1.0,
      data: {
        datasets: [{
          data: this.getRequestCounts(selectedRequests),
          backgroundColor: this.getSchemeColors(colorScheme),
          borderWidth: 0,
        }],
        labels: this.getLabels(),
      },
      options: {
        cutoutPercentage: 50,
        legend: false,
        title: {
          display: false
        },
        animation: {
          animateScale: false,
          animateRotate: true,
          easing: 'easeOutQuart',
          duration: 1000,
        },
        plugins: {
          chartArea: {
            chartBgColor: '#27272b',
          },
        },
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedRequests !== this.props.selectedRequests) {
      this.chart.config.data.datasets[0].data = (
        this.getRequestCounts(this.props.selectedRequests)
      );
      this.chart.update();
    } else if (prevProps.colorScheme !== this.props.colorScheme) {
      this.chart.config.data.datasets[0].backgroundColor = (
        this.getSchemeColors(this.props.colorScheme)
      );
      this.chart.update();
    }
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <canvas height={250} ref={this.canvasRef} />
      </div>
    )
  }
}

RequestsDonut.propTypes = {
  selectedRequests: PropTypes.shape({}),
  colorScheme: PropTypes.string.isRequired,
};

RequestsDonut.defaultProps = {
  selectedRequests: {},
};

export default RequestsDonut;
