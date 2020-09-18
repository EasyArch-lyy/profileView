import { message } from 'dtd';
import { setCookie } from "../utils/cookie";
import {
  queryCurrent,
  changeAuthority,
  searchUsers,
} from '../services/user';

export default {
  namespace: 'user',

  state: {
    // 用户列表
    userList: [],
    userInfo: {},
    loading: false,
    // 用户权限开启与否判断
    isAuthFormShow: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
      }
    },
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: JSON.parse(response),
        });
        const data = {
          username: JSON.parse(response).user,
        };
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
          }
        });
      }
    },
    *changeAuthority({ payload, callback = () => {} }, { call }) {
      try {
        yield call(changeAuthority, payload);
        message.success('更改用户权限成功');
        callback();
      } catch (e) {
        message.error('更改用户权限失败，请重试');
      }
    },
    *searchUsers({ payload }, { call, put }) {
      const response = yield call(searchUsers, payload);
      if (response) {
        yield put({
          type: 'changeUserList',
          payload: response,
        });
      }
    },
  },
  reducers: {
    // 用户列表
    changeUserList(state, { payload }) {
      return {
        ...state,
        userList: JSON.parse(payload),
      };
    },
    changeAuthShowForm(state, { payload }) {
      return {
        ...state,
        isAuthFormShow: payload.isAuthFormShow,
        userInfo: payload.record,
      };
    },
  }
}

