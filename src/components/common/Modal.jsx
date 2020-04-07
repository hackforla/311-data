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
    <div className={modalClassName}>
      <div className="modal-background" />
      <div className="modal-content" style={{ overflow: 'visible', ...style }}>
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
