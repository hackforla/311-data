import React from 'react';
import COLORS from '../../../styles/COLORS';

const footerTextStyle = {
  color: COLORS.BACKGROUND,
  fontWeight: 'bold',
  width: '100vw',
};

const Footer = () => (
  <footer
    className="navbar has-navbar-fixed-bottom"
    style={{
      position: 'fixed',
      bottom: '0',
      height: '45px',
      background: '#002449',
      // Really high z-index here to ensure Footer is on top of modal
      zIndex: '20000',
    }}
  >
    <div className="level has-text-centered">
      <div className="level-item">
        <p style={footerTextStyle}>
          Data Updated Through:
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
