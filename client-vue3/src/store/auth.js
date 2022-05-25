import { defineStore } from "pinia";
import { login } from "@/api/index";
import { AUTH } from "@/store/types";
import { getTree } from "@/utils/tools.js";

export const useAuthStore = defineStore(AUTH, {
  persist: true,

  state: () => ({
    authUser: null, // 登录的用户信息
  }),

  actions: {
    async login(data) {
      const user = await login(data);
      if (!user) {
        return Promise.reject("登录失败");
      }
      this.authUser = user;
      return Promise.resolve(user);
    },

    logout() {
      // this.$reset();
      this.authUser = null;
    },
  },

  getters: {
    isLogin() {
      return Boolean(this.authUser);
    },
    permissions() {
      if (this.authUser && this.authUser.permissions) {
        return this.authUser.permissions;
      }
      return [];
    },
    menus() {
      let menus = [];
      if (this.authUser && this.authUser.permissions) {
        menus = getTree(this.authUser.permissions);
      }
      return menus;
    },
  },
});
