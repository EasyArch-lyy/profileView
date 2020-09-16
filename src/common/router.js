import React from 'react';
import dynamic from 'dva/dynamic';
import { getFlatMenuData } from './menu';

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
    },
    '/user/login': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../routes/User/Login'))
    },
    '/profile': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/profile/index'))
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
  };

  const menuData = getFlatMenuData({});
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    const menuDataKey = item.replace(/^\//, '');
    routerDataWithName[item] = {
      ...routerData[item],
      authority: menuData[menuDataKey] ? menuData[menuDataKey].authority : null,
      name: routerData[item].name || menuData[menuDataKey] ? menuData[menuDataKey].name : null,
    };
  });
  return routerDataWithName;
};

export const getPageTitle = (routerData, location) => {
  const { pathname } = location;
  let title = 'SPL';
  if (routerData[pathname] && routerData[pathname].name) {
    title = `${routerData[pathname].name} - SPL`;
  }
  return title;
};

