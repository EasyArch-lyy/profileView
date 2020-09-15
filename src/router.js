import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import { Spin } from 'dtd';
import dynamic from 'dva/dynamic';
import styles from './index.less'
import { getRouterData } from './common/router';

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
        <Route path="/" render={props => <UserLayout {...props} />} />
        <Route path="/user" render={props => <BasicLayout {...props} />} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
