import store from '../index';

const PERMISSION = {
  USER: 2,
  ADMIN: 0,
}

const menuData = [
  {
    name: '配置展示',
    icon: 'renzhengguanlicopy',
    path: 'showProfile',
    pid: 'Y',
    authority: [PERMISSION.USER, PERMISSION.ADMIN],
  },
  {
    name: '系统管理',
    icon: 'configuration',
    path: 'SystemManagement',
    authority: [PERMISSION.USER, PERMISSION.ADMIN],
    children: [
      {
        name: '用户管理',
        path: 'userManagement',
        authority: [PERMISSION.ADMIN],
      },
    ],
  },
];

/* 扁平化结构 */
function formatterFlat(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = {
        authority: item.authority,
        name: item.name,
      };
      keys = { ...keys, ...formatterFlat(item.children) };
    } else {
      keys[item.path] = {
        authority: item.authority,
        name: item.name,
      };
    }
  });
  return keys;
}

function formatter(data, parentPath = '', productId) {
  let getState;
  let id;
  if (productId) {
    id = productId;
  } else if (store && store.getState) {
    getState = store.getState;
  }
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: item.pid === 'Y' ? `/${id}/${parentPath}${item.path}` : `${parentPath}${item.path}`,
        children: formatter(item.children,
          item.pid === 'Y' ? `/${id}/${parentPath}${item.path}/` : `${parentPath}${item.path}/`, productId),
      });
    } else {
      list.push({
        ...item,
        path: item.pid === 'Y' ? `/${id}/${parentPath}${item.path}` : `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData, '');
export const getFlatMenuData = () => formatterFlat(formatter(menuData, ''));
