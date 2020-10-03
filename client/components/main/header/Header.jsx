import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import clx from 'classnames';
import AccessibilityPane from './AccessibilityPane';
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
    if (e.key === ' ' || e.key === 'Enter') {
      handleClick(e);
    }
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      id="top-navbar"
    >
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <div className="navbar-item">
            <p style={cta1Style}>311</p>
            <p style={cta2Style}>DATA</p>
          </div>
          <div className="navbar-item beta-tag-wrapper">
            <span className="beta-tag">BETA</span>
          </div>
        </Link>
        <a // eslint-disable-line
          role="button"
          tabIndex={0}
          className={clx('navbar-burger', {
            'is-active': activeBurger,
          })}
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

      <div
        id="navbar"
        className={clx('navbar-menu', { 'is-active': activeBurger })}
      >
        <div className="navbar-end">
          <div className="navbar-item">
            <NavLink
              exact
              to="/data"
              activeClassName="navbar-selected"
              style={backgroundStyle}
            >
              Explore My Council&apos;s 311 Data
            </NavLink>
          </div>
          <div className="navbar-item">
            <NavLink
              exact
              to="/comparison"
              activeClassName="navbar-selected"
              style={backgroundStyle}
            >
              Compare Different Councils
            </NavLink>
          </div>
          <div className="navbar-item">
            <NavLink
              exact
              to="/about"
              activeClassName="navbar-selected"
              style={backgroundStyle}
            >
              About 311 Data
            </NavLink>
          </div>
          <div className="navbar-item">
            <NavLink
              exact
              to="/contact"
              activeClassName="navbar-selected"
              style={backgroundStyle}
            >
              Contact Us
            </NavLink>
          </div>
          <div className="navbar-item navbar-helplink">
            <NavLink
              exact
              to="/faq"
              activeClassName="navbar-selected"
              style={backgroundStyle}
            >
              Help Center
            </NavLink>
          </div>
          <div className="navbar-item">
            <AccessibilityPane />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
