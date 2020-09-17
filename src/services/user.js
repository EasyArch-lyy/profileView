import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

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
// 请求错误 404: http://localhost:8081/login/getUser/getloginuser
// 发出的请求针对的是不存在的记录，服务器没有进行操作
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

