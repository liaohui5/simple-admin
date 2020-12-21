import { getTree } from "@/tools/index";
export default {
  namespaced: true,
  state: {
    authUser: null
  },

  getters: {
    isLogin(state) {
      return !!state.authUser;
    },
    user(state) {
      return state.authUser || {};
    },
    permissions(state) {
      // 获取用户的所有路由权限
      if (!state.authUser || !state.authUser.permissions) {
        return [];
      }
      return state.authUser.permissions;
    },
    permissionsTree(state) {
      // 获取用户的所有路由权限并生成树形结构数据
      if (!state.authUser || !state.authUser.permissions) {
        return [];
      }
      return getTree(state.authUser.permissions);
    }
  },

  mutations: {
    login(state, user) {
      state.authUser = user;
    },
    logout(state) {
      state.authUser = null;
    }
  }
};
