import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Divider, Icon } from 'dtd';
import Styles from './index.less';

export default class TopTitle extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    backUrl: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    backUrl: '',
  };

  render() {
    return (
      <div>
        <div className={Styles.topTitle}>
          {this.props.title}
          {
            this.props.backUrl ? (
              <Link to={this.props.backUrl}>
                <Icon type="rollback" prev="dtdicon" />
              </Link>
            ) : null
          }
        </div>
        <Divider className={Styles.divider} />
      </div>
    );
  }
}
