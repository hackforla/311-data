import React from 'react';
import COLORS from '../../../styles/COLORS';

const footerTextStyle = {
  color: COLORS.BACKGROUND,
  fontWeight: 'bold',
  width: '100vw',
};

const Footer = () => (
  <nav
    className="navbar has-navbar-fixed-bottom"
    style={{
      position: 'fixed',
      bottom: '0',
      height: '45px',
      background: '#002449',
    }}
  >
    <div className="level has-text-centered">
      <div className="level-item">
        <p style={footerTextStyle}>
          Data Updated Through:
        </p>
      </div>
    </div>
  </nav>
);

export default Footer;
