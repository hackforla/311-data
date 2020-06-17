import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { disableSplashPage } from '@reducers/ui';
import COLORS from '../../../styles/COLORS';

const Header = ({
  disableSplash,
  splashPageDisabled,
}) => {
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
        <Link
          to="/"
          className="navbar-item"
          onClick={() => {
            if (!splashPageDisabled) {
              disableSplash();
            }
          }}
        >
          <div className="navbar-item">
            <p style={cta1Style}>311</p>
            <p style={cta2Style}>DATA</p>
          </div>
          <div className="navbar-item beta-tag-wrapper">
            <span className="beta-tag">BETA</span>
          </div>
        </Link>
      </div>

      <div id="navbar" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <NavLink to="/comparison" activeClassName="navbar-selected" style={cta2Style}>
              Comparison Tool
            </NavLink>
          </div>
          <div className="navbar-item">
            <NavLink to="/about" activeClassName="navbar-selected" style={backgroundStyle}>
              About 311 Data
            </NavLink>
          </div>
          <div className="navbar-item">
            <NavLink to="/contact" activeClassName="navbar-selected" style={backgroundStyle}>
              Contact Us
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  splashPageDisabled: PropTypes.bool.isRequired,
  disableSplash: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  splashPageDisabled: state.ui.splashPageDisabled,
});

const mapDispatchToProps = dispatch => ({
  disableSplash: () => dispatch(disableSplashPage()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
