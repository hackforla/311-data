import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';
import Icon from '@components/common/Icon';

// this content is inserted into the DynamicTooltip
// when user hovers on a chart element
const ChartTooltipContent = ({
  lines,
}) => (
  <div className="chart-tooltip">
    {
      lines.map(({ text, color, bold }, idx) => (
        <div
          key={idx.toString()}
          className={clx('chart-tooltip-line', { bold })}
        >
          { color && (
            <Icon
              id="chart-tooltip-icon"
              icon="circle"
              size="small"
              style={{
                color,
                marginRight: '8px',
              }}
            />
          )}
          { text }
        </div>
      ))
    }
  </div>
);

export default ChartTooltipContent;

ChartTooltipContent.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    color: PropTypes.string,
    bold: PropTypes.bool,
  })),
};

ChartTooltipContent.defaultProps = {
  lines: [],
};

// allows the ChartJS custom tooltip function to return a React
// component instead of doing old-school DOM manipulation
// see https://www.chartjs.org/docs/latest/configuration/tooltip.html
export function adapter(getTooltipContent) {
  return function customTooltip(tooltipModel) {
    const { _chart: chart } = this;
    if (!chart.tooltipRef) return;

    if (tooltipModel.opacity === 0) {
      chart.tooltipRef.hide();
    } else {
      chart.tooltipRef.show({
        content: getTooltipContent(tooltipModel, chart),
        offset: {
          left: tooltipModel.caretX,
          top: tooltipModel.caretY,
        },
        position: tooltipModel.caretX > chart.width / 2
          ? 'left'
          : 'right',
      });
    }
  };
}
