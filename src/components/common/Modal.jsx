import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import { closeDateRangeModal } from '../../redux/reducers/data';

const Modal = ({
  open,
  content,
  style,
  closeModal,
}) => {
  const modalClassName = classNames('modal', {
    'is-active': open,
  });

  useEffect(() => {
    const handleEscapeClick = (e) => {
      if (e.keyCode === 27) {
        closeModal();
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
  }, [open, closeModal]);

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

const mapStateToProps = (state) => ({
  open: state.data.dateRangeModalOpen,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeDateRangeModal()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Modal);

Modal.propTypes = {
  open: PropTypes.bool,
  content: PropTypes.element.isRequired,
  style: PropTypes.shape({}),
  closeModal: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  open: false,
  style: undefined,
};
