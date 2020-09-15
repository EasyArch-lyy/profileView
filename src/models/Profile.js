import {
  getProfile
} from '../services/profile';

export default {
  namespace: 'profile',

  state: {
    profileList: [],
  },

  effect: {
    // 获取配置文件页
    *getProfile({ call, put }) {
      const response = yield call(getProfile());
      if(response) {
        yield put({
          type: '',
          payload: response,
        });
      }
    }
  },
  reducers: {
    changeProfileList(state, { payload }) {
      return {
        ...state,
        profileList: payload,
      }
    },
  },

  subscriptions: {},
};
