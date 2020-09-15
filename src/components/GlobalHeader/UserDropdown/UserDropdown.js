import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { Avatar, Dropdown, Icon, Menu, Modal } from 'dtd';
import { SUPER_ADMIN_ID } from 'Common/const';
import { getCookie } from 'Utils/cookie';
import styles from './index.less';


@connect(state => ({
  currentDeptId: state.user.currentDeptId,
  currentUser: state.login.currentUser,
}))
export default class UserDropdown extends PureComponent {
  static propTypes = {
    currentDeptId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    className: PropTypes.string,
    currentUser: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    currentDeptId: -1,
    currentUser: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      logoutVisible: false,
      confirmLoading: false,
    };
  }

  componentDidMount() {
    const isLogin = getCookie('isLogin');
    const { dispatch, currentUser } = this.props;
    // 登陆后带的转跳信息
    if (isLogin === 'true') {
      // 如果没有用户数据则获取一次
      if (JSON.stringify(currentUser) === '{}') {
        dispatch({
          type: 'user/fetchCurrent',
        }).then(() => {
          if (currentUser.user === null) {
            dispatch({
              type: 'login/logout',
            });
          }
        });
      }
    } else {
      dispatch({
        type: 'login/logout',
      });
    }
  }

  // menu点击选择时
  onMenuClick = (selected) => {
    const { currentUser, currentDeptId } = this.props;
    const { depts } = currentUser;
    const { key } = selected;

    // logout click
    if (key === 'logout') {
      this.setState({
        logoutVisible: true,
      });
      return;
    }

    // change dept
    for (let i = 0, len = depts.length; len > i; i++) {
      const dept = depts[i];
      const id = `${dept.id}`;
      if (id === key) {
        if (currentDeptId.toString() !== id) {
          this.props.dispatch({
            type: 'user/changeDept',
            currentDeptId: id,
          }).then(() => {
            // fix: 切换前可能在有权限的页面, 这里需要跳转到有权限的第一个页面.
            this.props.dispatch(routerRedux.replace('/'));
          });
        }
        return;
      }
    }

    console.log(`未找到这个key: ${key}, 请检查!`);
  };


  onLoginOutOkHandler = () => {
    const { dispatch } = this.props;
    this.setState({
      confirmLoading: true,
    });
    dispatch({
      type: 'login/logout',
      resolve: () => {
        this.dismissLogoutModal();
      },
    });
  };
  handleLogin = () => {
    const { dispatch } = this.props;
    this.setState({
      confirmLoading: true,
    });
    dispatch({
      type: 'login/logout',
    });
  };

  /* 获取用户角色信息 */
  getRoleName = (userId, deptId, roles) => {
    if (userId === SUPER_ADMIN_ID) {
      return '超级管理员';
    }
    let role = null;
    if (roles) {
      const roleInfo = roles.filter(item => item.deptId && item.deptId.toString() === deptId.toString());
      if (roleInfo && roleInfo.length > 1) {
        console.debug('当前选择的部门不止一个角色, 目前新显示第一个角色名称.');
      }
      if (roleInfo && roleInfo[0]) {
        role = roleInfo[0].name;
      }
    }
    return role;
  }

  dismissLogoutModal = () => {
    this.setState({
      logoutVisible: false,
      confirmLoading: false,
    });
  };

  render() {
    const { currentUser, currentDeptId, className } = this.props;
    const { logoutVisible, confirmLoading } = this.state;
    const { depts, roles } = currentUser;
    const role = this.getRoleName(currentUser.id, currentDeptId, roles);

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {
          depts && depts.length > 0 && depts.map(item => (
            <Menu.Item key={item.id}>
              <Icon type="appstore" />
              {item.name}
              {item.id.toString() === currentDeptId.toString() && <Icon type="check" className={styles.curDeptId} />}
            </Menu.Item>
          ))
        }
        {
          depts && depts.length > 0 && (
            <Menu.Divider />
          )
        }
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    if (currentUser.displayname) {
      return (
        <div className={styles.user}>
          <Dropdown overlay={menu} trigger={['click']}>
            <div className={`${className} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
              <div className={styles.names}>
                <span className={styles.name}>{currentUser.displayname}</span>
                {role ? (<span>{role}</span>) : null}
              </div>
            </div>
          </Dropdown>
          <Modal
            title="提示"
            visible={logoutVisible}
            onOk={this.onLoginOutOkHandler}
            confirmLoading={confirmLoading}
            onCancel={this.dismissLogoutModal}
          >
            <p>确认注销账户?</p>
          </Modal>
        </div>
      );
    } else {
      return (
        <div className={className} onClick={this.handleLogin.bind(this)}>未登录</div>
      );
    }
  }
}
