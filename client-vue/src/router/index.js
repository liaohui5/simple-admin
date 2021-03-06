import Vue from "vue";
import store from "../store";
import VueRouter from "vue-router";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // progress bar style
NProgress.configure({ showSpinner: false });

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/login",
      name: "login",
      meta: { isPublic: true },
      component: () => import("@/views/Login.vue")
    },
    {
      path: "/",
      name: "home",
      redirect: { name: "welcome" },
      component: () => import("@/views/Main.vue"),
      children: [
        {
          path: "/users",
          name: "users",
          component: () => import("@/views/Users.vue")
        },
        {
          path: "/roles",
          name: "roles",
          component: () => import("@/views/Roles.vue")
        },
        {
          path: "/permissions",
          name: "permissions",
          component: () => import("@/views/Permissions.vue")
        },
        {
          name: "edit_password",
          path: "/edit_password",
          meta: { dontCheckPermission: true }, // 不需要鉴定权限
          component: () => import("@/views/Users/EditPassword.vue")
        },
        {
          path: "*",
          name: "welcome",
          meta: { dontCheckPermission: true }, // 不需要鉴定权限
          component: () => import("@/views/Welcome.vue")
        }
      ]
    }
  ]
});

/**
 * 判断是否能访问
 * @param {*} path 当前路由
 */
const canNext = path => {
  const menus = store.getters["login/permissions"];
  const len = menus.length;
  if (!len) return false;
  for (let i = 0; i < len; i++) {
    if (menus[i].path === path) {
      return true;
    }
  }
  return false;
};

/**
 * 验证登录, 路由守卫
 */
router.beforeEach((to, from, next) => {
  NProgress.start();

  // 不需要登录: 直接访问
  if (to.meta.isPublic) {
    return next();
  }

  // 判断是否登录
  if (!store.getters["login/isLogin"]) {
    return router.replace({ name: "login" });
  }

  // 判断是否有权限访问
  if (!to.meta.dontCheckPermission && !canNext(to.path)) {
    Message.error("没有权限访问该页面");
    return router.replace({ name: "welcome" });
  }

  return next();
});

/**
 * 让顶部进度条结束
 */
router.afterEach(() => NProgress.done());

export default router;
