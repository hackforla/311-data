import React from 'react';

import COLORS from '../../../styles/COLORS';

const Header = () => {
  const cta2Style = {
    color: COLORS.BRAND.CTA2,
    fontWeight: 'bold',
  };

  const backgroundStyle = {
    color: COLORS.BACKGROUND,
    fontWeight: 'bold',
  };

  const cta1Style = {
    color: COLORS.BRAND.CTA1,
    fontWeight: 'bold',
  };

  return (
    <header
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: COLORS.BRAND.MAIN,
        height: '60px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        // Really high z-index here to ensure Header is on top of modal
        zIndex: '20000',
      }}
    >
      <div className="navbar-brand">
        <div className="navbar-item">
          <p style={cta1Style}>311</p>
          <p style={cta2Style}>Data</p>
        </div>
      </div>

      <div id="navbar" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <a href="/" style={cta2Style}>
              CSV Reporter
            </a>
          </div>
          <div className="navbar-item">
            <a href="/" style={backgroundStyle}>
              About 311 Data
            </a>
          </div>
          <div className="navbar-item">
            <a href="/" style={backgroundStyle}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
