import { createRouter, createWebHashHistory } from "vue-router";
import { beforeEach, afterEach } from "@/router/guards.js";

import Login from "@/views/login/index.vue";
import User from "@/views/user/index.vue";
import Main from "@/views/main/index.vue";
import Welcome from "@/views/main/welcome.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    meta: { isPublic: true },
    component: Login,
  },
  {
    path: "/",
    component: Main,
    children: [
      {
        path: "/",
        name: "Welcome",
        meta: { dontCheckPermission: true },
        component: Welcome,
      },
      {
        path: "/users",
        component: User,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(beforeEach);
router.afterEach(afterEach);

export default router;
