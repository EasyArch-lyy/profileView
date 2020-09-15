import React, { PureComponent } from 'react';
import { Icon, Layout, Menu } from 'dtd';
import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import { Link } from 'dva/router';
import logoOnly from 'Assets/logo-dtdream-dtp2.png';
import styles from './index.less';
import { check } from '../../components/Auth';

const { Sider } = Layout;
const { SubMenu } = Menu;

@connect(state => ({
  permissionIds: state.user.permissionIds,
  currentUser: state.login.currentUser,
  productList: state.login.productList,
  currentProduct: state.login.currentProduct,
  currentMenu: state.login.currentMenu,
}))
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  /**
   * 获取默认的展开menu
   * #/org/org_auth/org_role -> ["org", "org/org_auth"]
   * */
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    const snippets = pathname.split('/').slice(1, -1);
    const currentPathSnippets = snippets.map((item, index) => {
      const arr = snippets.filter((_, i) => i <= index);
      return arr.join('/');
    });
    let currentMenuSelectedKeys = [];
    currentPathSnippets.forEach((item) => {
      currentMenuSelectedKeys = currentMenuSelectedKeys.concat(this.getSelectedMenuKeys(item));
    });
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }

    return currentMenuSelectedKeys;
  }

  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach((item) => {
      if (item.children) {
        keys.push(item.path);
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      } else {
        keys.push(item.path);
      }
    });
    return keys;
  }

  getSelectedMenuKeys = (path) => {
    const flatMenuKeys = this.getFlatMenuKeys(this.props.currentMenu);
    const key = path.replace(/^\//, '');

    if (flatMenuKeys.indexOf(key) > -1) {
      return [key];
    }
    if (flatMenuKeys.indexOf(key.replace(/\/$/, '')) > -1) {
      return [key.replace(/\/$/, '')];
    }

    const selectedMenuKeys = flatMenuKeys.filter((item) => {
      const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
      const itemRegExp = new RegExp(itemRegExpStr);
      return itemRegExp.test(key) || itemRegExp.test(path);
    });

    return selectedMenuKeys;
  };

  getNavMenuItems(menusData) {
    if (!menusData) {
      return [];
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      const hasPermission = check(item.authority);
      // const hasPermission = true;

      let itemPath;
      if (item.path && item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `/${item.path || ''}`.replace(/\/+/g, '/');
      }

      // fix: 当子元素全部hide的时候需要正确显示
      const hasSubmMenu = hasPermission && item.children &&
        item.children.some(child => child.name) && !item.children.every(child => child.hideInMenu);
      if (hasSubmMenu) {
        if (item.hideInMenu) {
          return null;
        } else {
          return (
            <SubMenu
              title={
                item.icon ? (
                  <span>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </span>
                ) : item.name
              }
              key={item.key || item.path}
            >
              {this.getNavMenuItems(item.children)}
            </SubMenu>
          );
        }
      }
      const icon = item.icon && <Icon type={item.icon} />;
      const hideMenuItem = item.hideInMenu || !hasPermission;
      if (hideMenuItem) {
        return null;
      } else {
        return (
          <Menu.Item key={item.key || item.path}>
            {
              /^https?:\/\//.test(itemPath) ? (
                <a href={itemPath} target={item.target}>
                  {icon}<span>{item.name}</span>
                </a>
              ) : (
                <Link
                  to={itemPath}
                  target={item.target}
                  replace={itemPath === this.props.location.pathname}
                >
                  {icon}<span>{item.name}</span>
                </Link>
              )
            }
          </Menu.Item>
        );
      }
    });
  }

  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.props.currentMenu.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  };

  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapsed } = this.props;
    this.onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  onSelect = (value) => {
    console.log(value);
  }

  render() {
    const { collapsed, location: { pathname }, currentMenu } = this.props;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };

    const Logo = collapsed ?
      (
        <div className={styles.logoInner}>
          <img src={logoOnly} alt="logo-only" />
        </div>
      ) :
      (
        <div className={styles.logoInner}>
          <img src={logoOnly} alt="logo-only" />
          {/* <div className={styles.divide} /> */}
          {/* <div className={styles.names}>
            <div className={styles.name}>数梦研发平台</div>
            <div className={styles.subName}>dtp.dtdream.com</div>
          </div> */}
        </div>
      );
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        onCollapse={this.onCollapse}
        width={200}
        className={styles.sider}
      >
        <div className={styles.logo}>
          <Link to="/">
            {Logo}
          </Link>
        </div>
        <div className={styles.toggle} onClick={this.toggle}>
          <Icon
            className={styles.trigger}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={this.getSelectedMenuKeys(pathname)}
          onSelect={this.onSelect}
          style={{ padding: '0 0 60px', width: '100%' }}
        >
          {this.getNavMenuItems(currentMenu)}
        </Menu>
      </Sider>
    );
  }
}
