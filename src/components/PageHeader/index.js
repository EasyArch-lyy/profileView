import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'dtd';
import { Link } from 'dva/router';
import styles from './index.less';

function getBreadcrumb(breadcrumbNameMap, url) {
  if (breadcrumbNameMap[url]) {
    return breadcrumbNameMap[url];
  }
  const urlWithoutSplash = url.replace(/\/$/, '');
  if (breadcrumbNameMap[urlWithoutSplash]) {
    return breadcrumbNameMap[urlWithoutSplash];
  }
  let breadcrumb = {};
  Object.keys(breadcrumbNameMap).forEach((item) => {
    const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
    const itemRegExp = new RegExp(itemRegExpStr);
    if (itemRegExp.test(url)) {
      breadcrumb = breadcrumbNameMap[item];
    }
  });
  return breadcrumb;
}

/* 通过路由来获取面包屑数据 */
function getBreadcrumbList(breadcrumbNameMap, location) {
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const list = [{ breadcrumbName: '首页', href: '/' }];

  pathSnippets.forEach((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
    const isLinkable = (index !== pathSnippets.length - 1) && currentBreadcrumb.component;
    if (currentBreadcrumb.name) {
      list.push({
        breadcrumbName: currentBreadcrumb.name,
        path: isLinkable ? url : undefined,
      });
    }
  });
  return list;
}

export default class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  getBreadcrumbProps = () => {
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      location: this.props.location || this.context.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    };
  };
  itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
  };

  render() {
    const { linkElement = 'a' } = this.props;
    let { breadcrumbList } = this.props;
    const { location, breadcrumbNameMap } = this.getBreadcrumbProps();

    if (!breadcrumbList) {
      breadcrumbList = getBreadcrumbList(breadcrumbNameMap, location, linkElement);
    }

    return <Breadcrumb className={styles.breadcrumb} routes={breadcrumbList} />;
  }
}
