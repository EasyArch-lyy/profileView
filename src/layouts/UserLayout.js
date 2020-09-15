import React from 'react';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { getPageTitle } from 'Common/router';
import logo from 'Assets/logo.png';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import { getRoutes } from '../utils/utils';

class UserLayout extends React.PureComponent {
  render() {
    const { routerData, match, location } = this.props;
    return (
      <DocumentTitle title={getPageTitle(routerData, location)}>
        <div className={styles.container}>
          <div className={styles.banner} />
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>DtDream</span>
              </Link>
            </div>
            <div className={styles.desc}>数据改变世界</div>
          </div>
          <div className={styles.middle}>
            {
              getRoutes(match.path, routerData).map(item =>
                (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                )
              )
            }
          </div>
          <GlobalFooter className={styles.footer} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
