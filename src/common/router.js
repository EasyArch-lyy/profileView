import React from 'react';
import dynamic from 'dva/dynamic';

const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        const P = Comp.default || Comp;
        resolve(props => <P {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    }
  }
}
