import { message } from 'dtd';
import { routerRedux } from 'dva/router';
// import { getMenuData } from 'Common/menu';
// import { getMenusWithUpdatedPath } from 'Common/originalDtpMenu';
import { accountLogout } from '../services/api';
import { setCookie } from '../utils/cookie';

import {
  queryCurrent,
  getPasswd,
  getUsers,
  accountLogin,
  delUser
} from '../services/user';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    currentUser: {},
    userList: [],
    currentMenu: [],
  },

  effects: {
    *login({payload}, {call, put}) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (response === 'success') {
        setCookie('isLogin', true);
        yield put({
          type: 'changeLoginStatus',
          payload: {status: true},
        });
        yield put(routerRedux.push('/'));
      } else {
        message.error('登录失败');
        setCookie('isLogin', false);
        yield put(routerRedux.push('/user/login'));
      }
    },
    *logout(_, { call, put }) {
      yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
    },
    *getUsers(_, { call, put }) {
      const response = yield call(getUsers);
      if (response) {
        yield put({
          type: 'changeGlobalUser',
          payload: response,
        });
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload,
      };
    },
    changeGlobalUser(state, { payload }) {
      return {
        ...state,
        userList: JSON.parse(payload),
      };
    },
  }

};
