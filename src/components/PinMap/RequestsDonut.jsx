import React from 'react';
import PropTypes from 'proptypes';
import ChartJS from 'chart.js';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

class RequestsDonut extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();

    this.types = [];
    this.colors = [];
    this.labels = [];

    Object.keys(REQUEST_TYPES).forEach(t => {
      this.types.push(t);
      this.colors.push(REQUEST_TYPES[t].color);
      this.labels.push(REQUEST_TYPES[t].displayName);
    });
  }

  componentDidMount() {
    const ctx = this.canvasRef.current.getContext('2d');
    this.chart = new ChartJS(ctx, {
			type: 'doughnut',
      aspectRatio: 1.0,
      data: {
        datasets: [{
          data: this.types.map(type => this.props.selectedRequests[type] || 0),
          backgroundColor: this.colors,
          borderWidth: 0,
        }],
        labels: this.labels
      },
			options: {
        cutoutPercentage: 50,
				legend: false,
				title: {
					display: false
				},
				animation: {
					animateScale: false,
					animateRotate: true
				}
			}
		});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedRequests !== this.props.selectedRequests) {
      console.log('updating donut');
      this.chart.config.data.datasets[0].data = (
        this.types.map(type => this.props.selectedRequests[type] || 0)
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
  selectedRequests: PropTypes.shape({})
};

RequestsDonut.defaultProps = {
  selectedRequests: {}
};

export default RequestsDonut;
