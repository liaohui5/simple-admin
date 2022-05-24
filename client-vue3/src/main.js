import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// https://meyerweb.com/eric/tools/css/reset/
import "reset-css";

// element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App).use(store).use(router).use(ElementPlus).mount("#app");
