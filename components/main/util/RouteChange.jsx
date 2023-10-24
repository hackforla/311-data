import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import PropTypes from 'proptypes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import actions from './routeChangeActions';

// Taken from
// https://reactrouter.com/en/main/start/faq#what-happened-to-withrouter-i-need-it
function withRouter(WrappedComponent) {
  const ComponentWithRouterProp = props => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const routerProps = { location, navigate, params };
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <WrappedComponent {...props} router={routerProps} />;
  };

  return ComponentWithRouterProp;
}

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
