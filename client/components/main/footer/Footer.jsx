import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import moment from 'moment';
import clx from 'classnames';
import HoverOverInfo from '@components/common/HoverOverInfo';
import SocialMediaLinks from './SocialMediaLinks';

const Footer = ({
  lastUpdated,
  version,
  backendSha,
  menuIsOpen,
  location: { pathname },
}) => {
  const frontendSha = process.env.GITHUB_SHA || 'DEVELOPMENT';
  return (
    <footer
      className={clx('navbar has-navbar-fixed-bottom', { 'menu-is-open': menuIsOpen && ['/data', '/comparison'].includes(pathname) })}
    >
      { version && backendSha && (
        <span className="version">
          <HoverOverInfo
            position="top"
            text={[
              frontendSha.substr(0, 7),
              backendSha.substr(0, 7),
            ]}
          >
            Version
            &nbsp;
            { version }
          </HoverOverInfo>
        </span>
      )}
      { lastUpdated && (
        <span className="last-updated">
          Data Updated Through:
          &nbsp;
          {moment(lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
        </span>
      )}
      <SocialMediaLinks />
    </footer>
  );
};

const mapStateToProps = state => ({
  lastUpdated: state.metadata.lastPulled,
  version: state.metadata.version,
  backendSha: state.metadata.gitSha,
  menuIsOpen: state.ui.menu.isOpen,
});

Footer.propTypes = {
  lastUpdated: PropTypes.string,
  version: PropTypes.string,
  backendSha: PropTypes.string,
  menuIsOpen: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

Footer.defaultProps = {
  lastUpdated: undefined,
  version: undefined,
  backendSha: undefined,
};

export default connect(mapStateToProps, null)(Footer);
