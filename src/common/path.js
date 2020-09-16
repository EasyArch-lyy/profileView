/*
存放各类资源路径
 */

/* if (process.env.NODE_ENV !== 'production') {
  const apiServer = 'http://101.132.92.129:8090/dtdream/v2/api';
} else {
  const apiServer = '/dtdream/v2/api';
} */
const apiServer = '';

// API 路径
export const API_PATH = {
  userLogin: `${apiServer}/uaa/login`,
  userLogout: `${apiServer}/uaa/logout`,
  demoTable: `${apiServer}/demoTable`,
};

// URL LINK 路径
export const URL_PATH = {
  userRegPage: '/user/register',
  userLoginPage: '/user/login',
};
