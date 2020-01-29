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

  // const quickviews = bulmaQuickview.attach();

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: COLORS.BRAND.MAIN,
        height: '60px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="navbar-brand">
        <div className="navbar-item">
          <p style={cta1Style}>311</p>
          <p style={cta2Style}>Data</p>
        </div>
      </div>

      <div id="navbar" className="navbar-menu">
        <button
          type="button"
          className="button is-primary"
          data-show="quickview"
          data-target="quickviewDefault"
        >
            Show quickview
        </button>
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
    </nav>
  );
};

export default Header;
