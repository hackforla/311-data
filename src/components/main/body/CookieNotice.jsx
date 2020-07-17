import React from 'react';
import PropTypes from 'proptypes';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { acceptCookies } from '@reducers/ui';

import Button from '@components/common/Button';
import Icon from '@components/common/Icon';

const CookieNotice = ({
  showCookieNotice,
  acceptCookieNotice,
}) => {
  const handleClick = () => {
    acceptCookieNotice();
    sessionStorage.setItem('accept-cookies', true);
  };

  if (showCookieNotice) {
    return (
      <div className="cookie-notice">
        <div className="cookie-title has-text is-size-6 has-text-weight-bold">
          <Icon
            id="tooltip-icon"
            icon="info-circle"
            size="small"
            style={{ marginRight: '6px' }}
          />
          Cookies and Privacy Policy
        </div>
        <div className="text has-text is-size-7">
          We use cookies and other tracking technologies to improve your browsing experience and to
          better understand our website traffic. By browsing our website, you consent to our use of
          cookies and other tracking technologies.&nbsp;
          <Link to="/privacy">Learn more</Link>
        </div>
        <Button
          id="cookie-notice"
          label="Got it!"
          size="small"
          handleClick={handleClick}
        />
      </div>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  showCookieNotice: !state.ui.cookiesAccepted,
});

const mapDispatchToProps = dispatch => ({
  acceptCookieNotice: () => dispatch(acceptCookies()),
});

CookieNotice.propTypes = {
  showCookieNotice: PropTypes.bool.isRequired,
  acceptCookieNotice: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CookieNotice);
