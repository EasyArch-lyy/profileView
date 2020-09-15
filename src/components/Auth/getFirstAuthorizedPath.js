import store from '../../index';
import { getMenuData } from '../../common/menu';
import check from './CheckPermissions.js';

const noMatch = null;
/**
 * 根据menu上的权限配置, 获取第一能有权限的路径
 * */
export default function getFirstAuthorizedPath(productId) {
  if (!store) return noMatch;
  const { user } = store.getState();
  if (!user) return noMatch;

  const findHasAuth = (list) => {
    let match = noMatch;
    for (let i = 0, len = list.length; len > i; i++) {
      const item = list[i];
      if (check(item.authority)) {
        if (item.children && item.children.length > 0) {
          match = findHasAuth(item.children);
        } else {
          match = `${item.path}`;
        }
        break;
      }
    }
    return match;
  };

  const menuList = getMenuData(productId);

  const res = findHasAuth(menuList);

  // console.log(`[getFirstAuthorizedPath] ${res}`);

  return res;
}

