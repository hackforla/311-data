import React, { useEffect } from 'react';
// import { connect } from 'react-redux';
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

  useEffect(() => {
    const handleEscapeClick = (e) => {
      if (e.keyCode === 27) {
        /*
        *  Dispatch modal closing action
        */
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeClick);
    } else {
      document.removeEventListener('keydown', handleEscapeClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeClick);
    };
  }, [open]);

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
      <button
        type="button"
        className="modal-close is-large"
        aria-label="close"
        onClick={() => {
          /*
          *  Dispatch modal closing action
          */
        }}
      />
    </div>
  );
};

// const mapStateToProps = (state) => {
//   const { modalOpen } = state;
//   return {
//     modalOpen,
//   };
// };

export default Modal;
// export default connect(mapStateToProps)(Modal);

Modal.propTypes = {
  open: PropTypes.bool,
  content: PropTypes.element.isRequired,
  style: PropTypes.shape({}),
};

Modal.defaultProps = {
  open: false,
  style: undefined,
};
