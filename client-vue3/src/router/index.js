import { createRouter, createWebHashHistory } from "vue-router";
import { beforeEach, afterEach } from "@/router/guards.js";

const routes = [
  {
    path: "/login",
    name: "Login",
    meta: { isPublic: true },
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/index.vue"),
  },
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "main" */ "@/views/main/index.vue"),
    redirect: { name: "Welcome" },
    children: [
      {
        path: "/users",
        name: "user",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/user/index.vue"),
      },
      {
        path: "/roles",
        name: "role",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/role/index.vue"),
      },
      {
        path: "/permissions",
        name: "permission",
        component: () =>
          import(/* webpackChunkName: "user" */ "@/views/permission/index.vue"),
      },
      {
        path: "/edit_password",
        name: "editPassword",
        meta: { dontCheckPermission: true },
        component: () =>
          import(
            /* webpackChunkName: "editPassword" */ "@/views/user/updatePassword.vue"
          ),
      },
      {
        path: "/",
        name: "Welcome",
        meta: { dontCheckPermission: true },
        component: () =>
          import(/* webpackChunkName: "welcome" */ "@/views/main/welcome.vue"),
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
