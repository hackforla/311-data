import React from 'react';
import PropTypes from 'proptypes';
import { openBlob, downloadBlob } from './utils';

const SelectItem = ({
  label,
  filename,
  getData,
  onClick,
  onComplete,
  openInTab,
}) => {
  const handleClick = () => {
    if (onClick) onClick();

    setTimeout(() => {
      getData().then(blob => {
        if (onComplete) onComplete();
        if (!blob) return;

        if (openInTab) {
          openBlob(blob);
        } else {
          downloadBlob(blob, filename);
        }
      });
    });
  };

  return (
    <button type="button" onClick={handleClick} tabIndex="0">
      { label}
    </button>
  );
};

export default SelectItem;

SelectItem.propTypes = {
  label: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  getData: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  onComplete: PropTypes.func,
  openInTab: PropTypes.bool,
};

SelectItem.defaultProps = {
  onClick: () => {},
  onComplete: () => {},
  openInTab: false,
};
