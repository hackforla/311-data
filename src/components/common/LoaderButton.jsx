/*
  A button with a loading indicator inside it.

  If the 'cta' prop is true, styles the button with orange background and
  brand text.
*/

import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';

const LoaderButton = ({
  onClick,
  label,
  cta,
  loading,
  loaderSize,
  style,
}) => (
  <button
    type="button"
    style={style}
    onClick={loading ? undefined : onClick}
    className={clx('loader-button', { cta, loading })}
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
  cta: PropTypes.bool,
  loading: PropTypes.bool,
  loaderSize: PropTypes.number,
  style: PropTypes.shape({}),
};

LoaderButton.defaultProps = {
  onClick: () => null,
  label: undefined,
  cta: false,
  loading: false,
  loaderSize: undefined,
  style: undefined,
};
