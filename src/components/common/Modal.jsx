import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const Modal = ({
  open,
  content,
  style,
}) => {
  const modalClassName = classNames('modal', {
    'is-active': open,
  });

  return (
    <div
      className={modalClassName}
      // This z-index is greater than the Menu component's z-index but less than
      // the Header and Footer. The modal will cover the Menu when open, but not
      // the Header or Footer.
      style={{ zIndex: '10000', ...style }}
    >
      <div className="modal-background" />
      <div className="modal-content" style={{ overflow: 'visible' }}>
        {content}
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  open: PropTypes.bool,
  content: PropTypes.element.isRequired,
  style: PropTypes.shape({}),
};

Modal.defaultProps = {
  open: false,
  style: undefined,
};
