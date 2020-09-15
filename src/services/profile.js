import { stringify } from 'qs';
import request from '../utils/request';

export async function getProfile(params) {
  return request(`/profile/getPage`)
}

export async function addProfile(params) {
  return request('/profile/addProfile', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
//Unhandled rejection RangeError: Maximum call stack size exceededill install loadIdealTree

export async function delProfile(params) {
  return request(`/profile/delProfile${stringify(params)}`)
}

export async function modifyProfile(params) {
  return request(`/profile/modifyProfile?${stringify(params.name)}`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
