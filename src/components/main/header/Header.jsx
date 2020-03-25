import React from 'react';
import { Link } from 'react-router-dom';
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
        <Link to="/" className="navbar-item">
          <div className="navbar-item">
            <p style={cta1Style}>311</p>
            <p style={cta2Style}>Data</p>
          </div>
        </Link>
      </div>

      <div id="navbar" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <Link to="/comparison" style={cta2Style}>
              Comparison Tool
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/about" style={backgroundStyle}>
              About 311 Data
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/contact" style={backgroundStyle}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
