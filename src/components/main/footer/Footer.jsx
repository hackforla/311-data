import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import propTypes from 'proptypes';
import moment from 'moment';
import StaticFooter from './StaticFooter';

const Footer = ({
  lastUpdated,
}) => (
  <footer className="navbar has-navbar-fixed-bottom">
    <Switch>
      <Route path="/(about|contact)" component={StaticFooter} />
      <Route path="/">
        <p>
          Data Updated Through:
          &nbsp;
          {lastUpdated && moment(1000 * lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
        </p>
      </Route>
    </Switch>
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
