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
    menus(state) {
      // 获取用户的所有路由权限并生成树形结构数据(侧边栏)
      if (!state.authUser || !state.authUser.permissions) {
        return [];
      }
      const permis = state.authUser.permissions.filter(item => item.icon);
      return getTree(permis);
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
