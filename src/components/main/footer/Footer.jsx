import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import propTypes from 'proptypes';
import moment from 'moment';

import COLORS from '../../../styles/COLORS';

const footerTextStyle = {
  color: COLORS.BACKGROUND,
  fontWeight: 'bold',
};

const Footer = ({
  lastUpdated,
}) => (
  <footer
    className="navbar has-navbar-fixed-bottom"
    style={{
      position: 'fixed',
      bottom: '0',
      height: '45px',
      background: '#002449',
      // Really high z-index here to ensure Footer is on top of modal
      zIndex: '20000',
    }}
  >
    <div className="level has-text-centered" style={{ width: '100vw' }}>
      <div className="level-item">
        <Switch>
          <Route path="/contact">
            <p style={footerTextStyle}>
              renderContactFooter
            </p>
          </Route>
          <Route path="/about">
            <p style={footerTextStyle}>
              renderAboutFooter
            </p>
          </Route>
          <Route path="/">
            <p style={footerTextStyle}>
              Data Updated Through:
              &nbsp;
              {lastUpdated && moment(1000 * lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
            </p>
          </Route>
        </Switch>
      </div>
    </div>
  </footer>
);

const mapStateToProps = state => ({
  lastUpdated: state.data.lastUpdated,
});

Footer.propTypes = {
  lastUpdated: propTypes.number,
};

Footer.defaultProps = {
  lastUpdated: undefined,
};

export default connect(mapStateToProps, null)(Footer);
