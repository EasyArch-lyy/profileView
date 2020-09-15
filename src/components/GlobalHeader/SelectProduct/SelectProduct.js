import React, { PureComponent } from 'react';
import { Select } from 'dtd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { withRouter } from 'react-router-dom';
import styles from './index.less';

const { Option } = Select;

@connect(state => ({
  permissionIds: state.user.permissionIds,
  currentUser: state.login.currentUser,
  productList: state.login.productList,
  currentProduct: state.login.currentProduct,
}))
export class SelectProduct extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.menus = getMenuData({ productId: this.props.currentProduct.id });
  // }

  handleSelectChange = (value) => {
    this.props.dispatch({
      type: 'login/setCurrentProduct',
      payload: {
        productId: value,
        username: this.props.currentUser.user,
      },
    }).then(() => {
      const path = this.props.location.pathname.split('/');
      path[1] = value;
      this.props.dispatch(routerRedux.push(path.join('/')));
    });
  };

  render() {
    const { productList, currentProduct } = this.props;
    return (
      <div className={styles.select}>
        <Select
          showSearch
          value={currentProduct.id}
          style={{ width: 170 }}
          className={styles.productSelect}
          dropdownMatchSelectWidth={false}
          dropdownClassName={styles.productSelectDropdown}
          onChange={this.handleSelectChange}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {productList.map((d) => {
            return <Option value={d.id} key={d.id.toString()} className={styles.selectItem} >{d.name}</Option>;
          })}
        </Select>
      </div>
    );
  }
}
export default withRouter(SelectProduct);
