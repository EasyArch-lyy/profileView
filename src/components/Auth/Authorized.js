import React from 'react';
import PropTypes from 'prop-types';
import CheckPermissions from './CheckPermissions';

export default class Authorized extends React.Component {
  static propTypes = {
    authority: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    children: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node,
    ]),
    noMatch: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.node,
    ]),
    oneOf: PropTypes.bool,
    needLogin: PropTypes.bool,
  };

  static defaultProps = {
    authority: null,
    children: null,
    noMatch: null,
    oneOf: true,
    needLogin: true,
  };

  render() {
    const { authority, children, noMatch: Exception, oneOf, needLogin } = this.props;
    const Target = typeof children === 'undefined' ? null : children;
    return CheckPermissions(
      authority,
      Target,
      Exception,
      oneOf,
      needLogin,
    );
  }
}
