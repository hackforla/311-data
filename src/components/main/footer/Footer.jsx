import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import propTypes from 'proptypes';
import moment from 'moment';
import HoverOverInfo from '@components/common/HoverOverInfo';
import StaticFooter from './StaticFooter';

const Footer = ({
  lastUpdated,
  version,
  backendSha,
}) => {
  const frontendSha = process.env.GITHUB_SHA || 'DEVELOPMENT';
  return (
    <footer className="navbar has-navbar-fixed-bottom">
      <Switch>
        <Route path="/(about|contact)" component={StaticFooter} />
        <Route path="/">
          { lastUpdated && (
            <span className="last-updated">
              Data Updated Through:
              &nbsp;
              {moment(1000 * lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
            </span>
          )}
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
        </Route>
      </Switch>
    </footer>
  );
};

const mapStateToProps = state => ({
  lastUpdated: state.metadata.lastPulled,
  version: state.metadata.version,
  backendSha: state.metadata.gitSha,
});

Footer.propTypes = {
  lastUpdated: propTypes.number,
  version: propTypes.string,
  backendSha: propTypes.string,
};

Footer.defaultProps = {
  lastUpdated: undefined,
  version: undefined,
  backendSha: undefined,
};

export default connect(mapStateToProps, null)(Footer);
