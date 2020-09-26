import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clx from 'classnames';
import COLORS from '../../../styles/COLORS';

const Header = () => {
  const [activeBurger, setActiveBurger] = useState(false);

  const cta2Style = {
    color: COLORS.BRAND.CTA2,
  };

  const backgroundStyle = {
    color: COLORS.BACKGROUND,
  };

  const cta1Style = {
    color: COLORS.BRAND.CTA1,
  };

  const handleClick = () => {
    setActiveBurger(!activeBurger);
  };

  const handleKeyDown = e => {
    if (e.key !== 'Tab' && e.key !== 'Shift' && e.key !== 'Alt') {
      handleClick(e);
    }
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <img id="navbar-logo" src={require('../../../assets/311-data-logo.png')} alt="311-Data logo"></img>
        </Link>
        <a // eslint-disable-line
          role="button"
          tabIndex={0}
          className={clx('navbar-burger', { 'is-active': activeBurger })}
          aria-label="menu"
          aria-expanded={activeBurger}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div className={clx('navbar-menu', { 'is-active': activeBurger })}>
        <div className="navbar-start">
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
        <div className="navbar-end">
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
    </nav>
  );
};

export default Header;
