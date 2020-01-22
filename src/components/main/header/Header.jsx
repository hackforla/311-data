import React from 'react';

const Header = () => {
  const blueItemStyle = {
    color: '#55D4D2',
    fontWeight: 'bold',
  };

  const whiteItemStyle = {
    color: '#FFFFFF',
    fontWeight: 'bold',
  };

  const yellowItemStyle = {
    color: '#FFB24A',
    fontWeight: 'bold',
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: '#002449',
        height: '60px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="navbar-brand">
        <div className="navbar-item">
          <p style={yellowItemStyle}>311</p>
          <p style={blueItemStyle}>Data</p>
        </div>
      </div>

      <div id="navbar" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <a href="/" style={blueItemStyle}>
              CSV Reporter
            </a>
          </div>
          <div className="navbar-item">
            <a href="/" style={whiteItemStyle}>
              About 311 Data
            </a>
          </div>
          <div className="navbar-item">
            <a href="/" style={whiteItemStyle}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
