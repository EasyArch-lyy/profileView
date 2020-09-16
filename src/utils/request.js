import fetch from 'dva/fetch';
import { notification } from 'dtd';
import { stringify } from 'qs';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  // const error = new Error(errortext);
  // error.response = response;
  // throw error;
  return null;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
    mode: 'cors',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
    if (typeof newOptions.body === 'string') {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
    } else if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = stringify(newOptions.body, { arrayFormat: 'repeat' });
    } else {
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (response) {
        if (newOptions.method === 'DELETE' || response.status === 204) {
          return response.text();
        }
        if (response.headers.get('Content-type') &&
        response.headers.get('Content-type').indexOf('application/vnd.ms-excel') > -1) {
          response.blob().then((blob) => {
            const a = window.document.createElement('a');
            const downUrl = window.URL.createObjectURL(blob);
            let filename = 'PPB.xls';
            if (response.headers.get('Content-Disposition')) {
              filename = response.headers.get('Content-Disposition').split('filename=')[1].split('.');
            }
            a.href = downUrl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(downUrl);
          });
          return {
            return_code: 20000,
            data: true,
          };
        }
        // return response.json();
        return response.text();
      } else {
        return null;
      }
    });
}
