import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function register(params) {
  return request('/login/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function accountLogout() {
  return request('/login/logout');
}

export async function accountLogin(params) {
  return request('/login/checkUserInfo', {
    method: 'POST',
    body: params,
  });
}

export async function getMouduleSketchListData(params) {
  return request(`/vmp/module/projectModuleConfig/getJiraModuleAll?${stringify(params)}`);
}

export async function syncMouduleSketchListData(params) {
  return request(`/vmp/module/projectModuleConfig/getModuleDataSync?${stringify(params)}`);
}

export async function syncMouduleJiraData() {
  return request('/vmp/projectmodule/getJiraComponents');
}

export async function mouduleCreate(params) {
  return request('/vmp/projectmodule/add', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}

export async function mouduleEdit(params) {
  return request('/vmp/projectmodule/update', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}

export async function mouduleDelete(params) {
  return request('/vmp/projectmodule/delete', {
    method: 'POST',
    body: {
      id: params.id,
      jira_component_id: params.jiraComponentId,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
}

