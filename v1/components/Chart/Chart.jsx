import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';
import ChartJS from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import ChartJSDataLabels from 'chartjs-plugin-datalabels';
import { DynamicTooltip } from '@components/common/Tooltip';
import InfoTitle from '@components/common/InfoTitle';
import { adapter } from './ChartTooltip';
import defaults from './defaults';
import { chartAreaPlugin } from './plugins';

/* ///////// CHARTJS CONFIG ////////// */

ChartJS.helpers.merge(ChartJS.defaults, defaults);
ChartJS.plugins.register(chartAreaPlugin);
ChartJS.plugins.unregister(ChartJSDataLabels);

/* //////////// COMPONENT //////////// */

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.tooltipRef = React.createRef();
    this.state = { top: 0, right: 0 };
  }

  componentDidMount() {
    const {
      type,
      data,
      datalabels,
    } = this.props;

    const ctx = this.canvasRef.current.getContext('2d');
    this.chart = new ChartJS(ctx, {
      type,
      data,
      options: this.getOptions(),
      plugins: datalabels ? [ChartJSDataLabels] : [],
    });
    this.setTopRight();
    this.chart.tooltipRef = this.tooltipRef.current;
  }

  componentDidUpdate(prevProps) {
    const { data, options } = this.props;

    if (prevProps.data !== data || prevProps.options !== options) {
      this.chart.data = data;
      this.chart.options = this.getOptions();
      this.chart.update();
      this.setTopRight();
    }
  }

  // add tooltip if passed as prop
  getOptions = () => {
    const { options, tooltip } = this.props;

    return {
      ...options,
      ...(tooltip ? {
        tooltips: {
          enabled: false,
          custom: adapter(tooltip),
        },
      } : {}),
    };
  };

  // calculate top-right corner of chart to position exportButton
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
      className,
      height,
      title,
      titleInfo,
      titleInfoPosition,
      exportButton,
      ariaLabelString,
    } = this.props;

    const { top, right } = this.state;

    const canvasWrapStyle = {
      position: 'relative',
      height: typeof height === 'undefined'
        ? undefined
        : `${height}px`,
    };

    const exportWrapStyle = {
      position: 'absolute',
      right,
      top: top - 4,
      transform: 'translateY(-100%)',
    };

    return (
      <div className={clx('chart', className)}>
        { title && (
          <InfoTitle
            title={title}
            infoText={titleInfo}
            position={titleInfoPosition}
          />
        )}
        <div style={canvasWrapStyle}>
          <canvas ref={this.canvasRef} aria-label={ariaLabelString} tabIndex="0" />
          <div style={exportWrapStyle}>{ exportButton }</div>
          <DynamicTooltip ref={this.tooltipRef} />
        </div>
      </div>
    );
  }
}

export default Chart;

Chart.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({}).isRequired,
  title: PropTypes.string,
  titleInfo: PropTypes.string,
  titleInfoPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  height: PropTypes.number,
  datalabels: PropTypes.bool,
  exportButton: PropTypes.element,
  className: PropTypes.string,
  tooltip: PropTypes.func,
  ariaLabelString: PropTypes.string,
};

Chart.defaultProps = {
  title: undefined,
  titleInfo: undefined,
  titleInfoPosition: 'right',
  height: undefined,
  datalabels: false,
  exportButton: null,
  className: undefined,
  tooltip: undefined,
  ariaLabelString: '',
};
