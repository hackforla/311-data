import React from 'react';
import { Link, NavLink } from 'react-router-dom';
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
          <img id="navbar-logo" src={require('../../../assets/311-data-logo.png')} alt="311-Data logo"></img>
        </Link>
      </div>

      <div id="navbar" className="navbar-menu">
        <div className="navbar">
          <div className="navbar-item">
            <NavLink exact to="/data" activeClassName="navbar-selected" style={backgroundStyle}>
              Explore My Council&apos;s 311 Data
            </NavLink>
          </div>
          <div className="navbar-item">
            <NavLink exact to="/comparison" activeClassName="navbar-selected" style={backgroundStyle}>
              Data Visualization
            </NavLink>
          </div>
        </div>
        <div id="navbar" className="navbar-end">
          <div className="navbar-item">
            <NavLink exact to="/about" activeClassName="navbar-selected" style={backgroundStyle}>
              About 311 Data
            </NavLink>
          </div>
          <div className="navbar-item">
            <NavLink exact to="/contact" activeClassName="navbar-selected" style={backgroundStyle}>
              Contact Us
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
