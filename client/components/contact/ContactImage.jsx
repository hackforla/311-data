import PropTypes from 'prop-types';
import React from 'react';
import './styles/contactimage.scss';

const ContactImage = ({ children }) => (
  <div className="contact-image-cover">
    <div className="contact-image-overlay-text">
      <span className="contact-image-text-contact">{children}</span>
    </div>
  </div>
);

ContactImage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContactImage;
