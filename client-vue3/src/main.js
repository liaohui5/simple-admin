import { createApp } from "vue";
import App from "@/App.vue";

// vue-router
import router from "@/router";

// pinia: https://pinia.web3doc.top/introduction.html
// import store from "./store";
import store from "@/store";

// https://meyerweb.com/eric/tools/css/reset/
import "reset-css";

// element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// global.css
import "@/assets/global.css";

createApp(App).use(store).use(router).use(ElementPlus).mount("#app");
