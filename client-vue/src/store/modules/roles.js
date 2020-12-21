import { getRoles } from "@/api/index";
export default {
  namespaced: true,
  state: {
    roles: []
  },
  actions: {
    async getRoles({ commit }) {
      const res = await getRoles();
      res.success && commit("getRoles", res.data);
    }
  },
  mutations: {
    getRoles(state, data) {
      state.roles = data;
    }
  }
};
