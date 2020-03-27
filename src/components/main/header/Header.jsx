import React from 'react';
import { Link } from 'react-router-dom';
import COLORS from '../../../styles/COLORS';

const Header = () => {
  const cta2Style = {
    color: COLORS.BRAND.CTA2,
  };

  const backgroundStyle = {
    color: COLORS.BACKGROUND,
  };

  const cta1Style = {
    color: COLORS.BRAND.CTA1,
  };

  return (
    <header
      className="navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <div className="navbar-item">
            <p style={cta1Style}>311</p>
            <p style={cta2Style}>DATA</p>
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
