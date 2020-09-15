import { Cookies } from 'react-cookie';

const cookie = new Cookies();

export const setCookie = (key, value) => {
  cookie.set(key, value, { path: '/' });
};

export const getCookie = (key) => {
  return cookie.get(key);
};

export const removeCookie = (key) => {
  cookie.remove(key, { path: '/' });
};
