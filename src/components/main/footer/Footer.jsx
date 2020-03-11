import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';
import moment from 'moment';

import COLORS from '../../../styles/COLORS';

const footerTextStyle = {
  color: COLORS.BACKGROUND,
  fontWeight: 'bold',
  width: '100vw',
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
    <div className="level has-text-centered">
      <div className="level-item">
        <p style={footerTextStyle}>
          Data Updated Through:
          &nbsp;
          {lastUpdated && moment(lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
        </p>
      </div>
    </div>
  </footer>
);

const mapStateToProps = state => ({
  lastUpdated: state.data.lastUpdated,
});

Footer.propTypes = {
  lastUpdated: propTypes.string,
};

Footer.defaultProps = {
  lastUpdated: undefined,
};

export default connect(mapStateToProps, null)(Footer);
