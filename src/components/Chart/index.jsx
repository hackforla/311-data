import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';
import ChartJS from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import ChartJSDataLabels from 'chartjs-plugin-datalabels';
import ChartExportSelect from '@components/export/ChartExportSelect';
import defaults from './defaults';
import { chartArea } from './plugins';

/* ///////// CHARTJS CONFIG ////////// */

ChartJS.helpers.merge(ChartJS.defaults, defaults);
ChartJS.plugins.register(chartArea);
ChartJS.plugins.unregister(ChartJSDataLabels);

/* //////////// COMPONENT //////////// */

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = { top: 0, right: 0 };
  }

  componentDidMount() {
    const {
      type,
      data,
      options,
      datalabels,
    } = this.props;

    const ctx = this.canvasRef.current.getContext('2d');
    this.chart = new ChartJS(ctx, {
      type,
      data,
      options,
      plugins: datalabels ? [ChartJSDataLabels] : [],
    });
    this.setTopRight();
  }

  componentDidUpdate(prevProps) {
    const { data, options } = this.props;

    if (prevProps.data !== data || prevProps.options !== options) {
      this.chart.data = data;
      this.chart.options = options;
      this.chart.update();
      this.setTopRight();
    }
  }

  // calculate top-right corner of chart to position export select
  setTopRight = () => {
    const { width, chartArea, config } = this.chart;
    const { layout } = config.options;

    let paddingTop = 0;
    let paddingRight = 0;

    if (layout) {
      paddingTop = typeof layout.padding === 'number'
        ? layout.padding
        : layout.padding?.top || 0;
      paddingRight = typeof layout.padding === 'number'
        ? layout.padding
        : layout.padding?.right || 0;
    }

    this.setState({
      top: chartArea.top - paddingTop,
      right: width - chartArea.right - paddingRight,
    });
  }

  render() {
    const {
      id,
      exportable,
      height,
      exportData,
      options,
      title,
    } = this.props;

    const { top, right } = this.state;

    const canvasWrapStyle = {
      position: 'relative',
      height: typeof height === 'undefined'
        ? undefined
        : `${height}px`,
    };

    const exportStyle = {
      position: 'absolute',
      right: right,
      top: top - 4,
      transform: 'translateY(-100%)',
    };

    return (
      <div className={clx('chart', id)}>
        { title && <h1>{ title }</h1> }
        <div style={canvasWrapStyle}>
          { exportable && (
            <div style={exportStyle}>
              <ChartExportSelect
                chartId={id}
                chartTitle={title || options.title?.text}
                exportData={exportData}
              />
            </div>
          )}
          <canvas ref={this.canvasRef} />
        </div>
      </div>
    );
  }
}

export default Chart;

Chart.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  height: PropTypes.number,
  datalabels: PropTypes.bool,
  exportable: PropTypes.bool,
  exportData: PropTypes.func,

  // NOTE: the title can come in either through the chart options or
  // a prop. If options, the title is on the chart canvas, which means
  // the export is much quicker. If props, the title is an HTML element.
  options: PropTypes.shape({
    title: PropTypes.shape({}),
  }).isRequired,
  title: PropTypes.string,
};

Chart.defaultProps = {
  height: undefined,
  datalabels: false,
  exportable: true,
  exportData: () => null,
  title: undefined,
};
