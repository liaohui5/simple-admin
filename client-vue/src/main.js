import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./extends";
import "reset.css"; // https://meyerweb.com/eric/tools/css/reset/
import "./plugins/element.js";
import "./plugins/cropper.js";
import "./assets/scss/global.scss";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  ...App
});
