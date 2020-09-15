import React, { PureComponent } from 'react';
import { Layout } from 'dtd';
import { connect } from 'dva';
import styles from './index.less';
import UserDropdown from './UserDropdown/UserDropdown';
import UserNotice from './UserNotice/UserNotice';
import SelectProducts from './SelectProduct/SelectProduct';

const { Header } = Layout;

@connect(state => ({
  currentProduct: state.login.currentProduct,
}))
export default class GlobalHeader extends PureComponent {
  render() {
    const { id } = this.props.currentProduct;
    const pathValue = this.props.location.pathname.split('/')[1];
    return (
      <Header className={styles.header}>
        <div className={styles.left}>
          {
            (/^[0-9]*$/.test(pathValue) && id === Number(pathValue)) ? <SelectProducts /> : null
          }
        </div>
        <div className={styles.right}>
          <UserNotice className={styles.action} />
          <UserDropdown className={styles.action} />
        </div>
      </Header>
    );
  }
}
