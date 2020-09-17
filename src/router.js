import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { Spin } from 'dtd';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import styles from './index.less'

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className ={styles.globalSpin} />;
})

function RouterConfig({ history, app }) {

  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;


  return (
    <Router history={history}>
      <Switch>
        <Route path="/user" render={props => <UserLayout {...props} />} />
        <Route path="/" render={props => <BasicLayout {...props} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
