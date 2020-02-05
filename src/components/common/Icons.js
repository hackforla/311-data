import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const Icons = ({
  id,
  label,
  handleClick,
  iconTag,
  iconSize,
  /*
   *  Props below correspond with Bulma modifiers.
  */
  color,
  size,
}) => {
  // Dynamically generates infoIcon className from props to comply with Bulma styling modifiers.
  const infoClassName = classNames('icon', {
    [`is-${size}`]: size, //for small, meduim, large, span tag
    [`has-text-${color}`]: color,
    [`fas-fa${iconSize}`]:iconSize //for fa-lg, fa-2x, fa-3x, icon tag
  });

  const infoIconId = `info-${id}`;

  return (
		<span
      id={infoIconId}
      onClick={handleClick}
      className={infoClassName}
  >
      <i className={iconTag}></i>
			{label}
		</span>
  );
};

export default Icons;

Icons.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  handleClick: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  iconTag:PropTypes.string,
  iconSize:PropTypes.string,
};

Icons.defaultProps = {
  label: null,
  handleClick: () => null,
  color: 'black',
  size: 'small',
};
