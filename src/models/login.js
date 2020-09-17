import { message } from 'dtd';
import { routerRedux } from 'dva/router';
// import { getMenuData } from 'Common/menu';
// import { getMenusWithUpdatedPath } from 'Common/originalDtpMenu';
import { accountLogout } from '../services/api';
import { setCookie } from '../utils/cookie';

import {
  getUsers,
  accountLogin,
  queryCurrent,
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
      if (response === 'true') {
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
    *fetchCurrent({ callback = () => {} }, { call, put }) {
      const response = yield call(queryCurrent);
      if (JSON.parse(response).user) {
        yield put({
          type: 'changeLoginStatus',
          payload: { status: true },
        });
        yield put({
          type: 'saveCurrentUser',
          payload: JSON.parse(response),
        });
        const data = {
          name: JSON.parse(response).name,
        };
        // 初始化所有用户
        yield put({
          type: 'getUsers',
          payload: {},
        });
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: { status: false },
        });
      }
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
