import React from 'react';
import { Redirect, Route } from 'dva/router';
import PropTypes from 'prop-types';
import Authorized from './Authorized';

export default class AuthorizedRoute extends React.Component {
  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.node,
      PropTypes.func,
    ]),
    render: PropTypes.func,
    authority: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    redirectPath: PropTypes.string,
    oneOf: PropTypes.bool,
    needLogin: PropTypes.bool,
  };
  static defaultProps = {
    component: null,
    render() {
    },
    authority: null,
    redirectPath: null,
    oneOf: true,
    needLogin: true,
  };

  render() {
    const {
      component: Component,
      render,
      authority,
      redirectPath,
      oneOf,
      needLogin,
      ...rest
    } = this.props;

    return (
      <Authorized
        authority={authority}
        oneOf={oneOf}
        needLogin={needLogin}
        noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
      >
        <Route
          {...rest}
          render={props => (Component ? <Component {...props} /> : render(props))}
        />
      </Authorized>
    );
  }
}
