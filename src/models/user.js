import { message } from 'dtd';
import { setCookie } from "../utils/cookie";
import {
  queryCurrent,
  changeAuthority,
} from '../services/user';

export default {
  namespace: 'user',

  state: {
    userList: [],
    loading: false,
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
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: JSON.parse(response),
        });
        const data = {
          username: JSON.parse(response).user,
        };
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
  },
  reducers: {

  }
}

