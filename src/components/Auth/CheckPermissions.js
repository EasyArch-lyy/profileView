import store from '../../index';

/**
 * 通用权限检查方法
 * 1. 是否登录
 * 2. 再鉴权
 *
 * Common check permissions method
 * @param { string | array } authority - 需要鉴定的权限, '60001' ['60001'] [60001]
 * @param { node | boolean } target - 通过的组件
 * @param { node | boolean } noMatch - 未通过的组件
 * @param { boolean } oneOf - 是否其中之一
 * @param { boolean } needLogin - 是否需要登录
 */
const checkPermissions = (authority, target = true, noMatch = false, oneOf = true, needLogin = false) => {
  if (!store) return noMatch;
  const { dispatch } = store;
  const { login } = store.getState();
  if (!login) return noMatch;

  // permissionIds like: [60001, 60002]
  const { currentUser } = login;
  const { roleId } = currentUser;
  const permissionIds = roleId && [roleId];

  // 如果要求登录但是未登录时
  if (needLogin && (!currentUser || currentUser.id === undefined)) {
    console.log('[checkPermissions] 这里跳转到登录, 请确认!');
    dispatch({
      type: 'login/login',
    });
    return null;
  }

  if (!permissionIds || permissionIds.length === 0) return noMatch;
  if (!authority || authority.length === 0) return target;

  const permissionIdsTmp = permissionIds.map(item => item.toString());

  if (Array.isArray(authority)) {
    const authorityTmp = authority.map(item => item.toString());

    if (oneOf) {
      const res = authorityTmp.some((item) => {
        return permissionIdsTmp.includes(item);
      });
      return res ? target : noMatch;
    } else {
      const res = authorityTmp.every((item) => {
        return permissionIdsTmp.includes(item);
      });
      return res ? target : noMatch;
    }
  } else if (typeof authority === 'string') {
    if (permissionIdsTmp.indexOf(authority) > -1) {
      return target;
    } else {
      return noMatch;
    }
  }
};

export { checkPermissions };

const check = (authority, target, noMatch, oneOf = true) => {
  return checkPermissions(authority, target, noMatch, oneOf);
};

export default check;
