import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';

const LoaderButton = ({
  onClick,
  label,
  loading,
  loaderSize,
  style,
  className,
}) => (
  <button
    type="button"
    style={style}
    onClick={loading ? undefined : onClick}
    className={clx(className, 'loader-button', { loading })}
  >
    { label }
    { loading && (
      <div className="loader-wrap">
        <div
          className="loader"
          style={{ width: loaderSize, height: loaderSize }}
        />
      </div>
    )}
  </button>
);

export default LoaderButton;

LoaderButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  loading: PropTypes.bool,
  loaderSize: PropTypes.number,
  style: PropTypes.shape({}),
  className: PropTypes.string,
};

LoaderButton.defaultProps = {
  onClick: () => null,
  label: undefined,
  loading: false,
  loaderSize: undefined,
  style: undefined,
  className: undefined,
};
