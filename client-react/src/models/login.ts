import { history } from 'umi';
export default {
  namespace: 'login',
  state: {
    authUser: null,
  },
  reducers: {
    // 注销登录
    logout(state: ILoginState) {
      window.localStorage.removeItem('auth-user');
      history.replace('/login');
      return {
        ...state,
        authUser: null,
      };
    },

    // 登录
    login(state: ILoginState, action: IDispatchAction) {
      window.localStorage.setItem('auth-user', JSON.stringify(action.payload));
      return {
        ...state,
        authUser: action.payload,
      };
    },
  },
  effects: {},
};
