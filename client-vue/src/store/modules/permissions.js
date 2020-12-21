import { getPermissions } from "@/api/index";
export default {
  namespaced: true,
  state: {
    permissions: {
      count: 0,
      rows: []
    },
    permissionTree: []
  },
  actions: {
    // 获取所有权限并分页
    async getPermissions({ commit }, query) {
      const res = await getPermissions(query);
      res.success && commit("getPermissions", res.data);
    },
    // 获取所有权限并生成树形结构
    async getPermissionTree({ commit }) {
      const res = await getPermissions({ type: 2 });
      res.success && commit("getPermissionTree", res.data);
    }
  },
  mutations: {
    getPermissions(state, data) {
      state.permissions = data;
    },
    getPermissionTree(state, data) {
      state.permissionTree = data;
    }
  }
};
