import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'proptypes';
import actions from './routeChangeActions';

class RouteChange extends Component {
  componentDidMount() {
    this.callRouteActions();
  }

  componentDidUpdate(prevProps) {
    const { location: { pathname } } = this.props;

    if (prevProps.location.pathname !== pathname) {
      this.callRouteActions();
    }
  }

  callRouteActions() {
    const {
      location,
      history,
    } = this.props;

    actions.forEach(action => {
      action(location, history);
    });
  }

  render() {
    return null;
  }
}

export default withRouter(RouteChange);

RouteChange.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
