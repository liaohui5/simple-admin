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
      // 获取用户的所有路由权限并生成树形结构数据(侧边栏菜单)
      if (!state.authUser || !state.authUser.permissions) {
        return [];
      }
      // !!因为有些页面不是在侧边栏点击进入的, 比如: 文章列表->文章详情
      // !!所以需要这个字段来判断是否是侧边栏的菜单, 如果没有 icon 则不显示到侧边栏
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
