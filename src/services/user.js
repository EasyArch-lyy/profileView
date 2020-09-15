import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

// 查询当前用户
export async function queryCurrent(params) {
  return request(`/login/getUser?${stringify(params)}`);
}

export async function getPasswd(params) {
  return request(`/login/getPasswd?${stringify(params)}`)
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
