import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';

const Tooltip = ({
  position,
  children,
}) => (
  <div className={clx('tooltip', position)}>
    { children }
    <div className="arrow" />
  </div>
);

export default Tooltip;

Tooltip.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  children: PropTypes.element,
};

Tooltip.defaultProps = {
  position: 'right',
  children: (<div />),
};

/*
  A wrapper for Tooltip that lets you control it imperatively
  through a ref, like this:

  tooltipRef.show({
    content,          // show any content
    offset: {         // offset from its parent container
      top,
      left,
    },
    position,         // 'right', 'left', 'top' or 'bottom'
  })

  tooltipRef.hide();  // hide the tooltip

  This is used for the chart tooltips.
*/
export class DynamicTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  show = ({
    content = null,
    offset = { top: 0, left: 0 },
    position = 'right',
  }) => {
    this.setState({
      visible: true,
      content,
      offset,
      position,
    });
  };

  hide = () => {
    this.setState({ visible: false });
  }

  render() {
    const {
      visible,
      content,
      offset,
      position,
    } = this.state;

    if (!visible) return null;

    const containerStyle = {
      position: 'absolute',
      width: 0,
      height: 0,
      top: offset.top,
      left: offset.left,
    };

    return (
      <div style={containerStyle}>
        <Tooltip position={position}>
          { content }
        </Tooltip>
      </div>
    );
  }
}
