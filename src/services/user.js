import { stringify } from 'qs';
import request from '../utils/request';

// 查询当前用户
export async function queryCurrent() {
  return request('/login/getloginuser');
}

export async function getPasswd(params) {
  return request(`/login/getPasswd?${stringify(params)}`)
}

export async function accountLogin(params) {
  return request(`/login/checkUserInfo?${stringify(params)}`);
}

export async function getUsers() {
  return request('/login/getAllUser');
}

export async function delUser(params) {
  return request(`/login/delUser?${stringify(params)}`)
}

export async function changeAuthority(params) {
  return request(`/login/changeAuthority?${stringify(params)}`, {
    method: 'POST',
    body: {},
  });
}

export async function searchUsers(params) {
  return request(`/login/searchUsers?${stringify(params)}`, {
    method: 'POST',
    body: JSON.stringify(params.user),
  });
}

