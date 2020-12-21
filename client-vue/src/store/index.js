import Vue from "vue";
import Vuex from "vuex";
import vuexPersistedstate from "vuex-persistedstate";
import login from "./modules/login";
import roles from "./modules/roles";
import permissions from "./modules/permissions";

const storagePlugin = vuexPersistedstate({
  storage: window.localStorage,
  paths: ["login.authUser"]
});

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [storagePlugin],
  modules: {
    login,
    roles,
    permissions
  }
});
