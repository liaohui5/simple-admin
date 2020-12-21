import Vue from "vue";
import store from "../store";
import VueRouter from "vue-router";
import { Message } from "element-ui";

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
          path: "*",
          name: "welcome",
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
  // 不需要登录: 直接访问
  if (to.meta.isPublic) {
    return next();
  }

  // 判断是否登录
  if (!store.getters["login/isLogin"]) {
    return router.replace({ name: "login" });
  }

  // 判断是否有权限(welcome: 不需要鉴别权限)
  if (!canNext(to.path) && to.name !== "welcome") {
    Message.error("没有权限访问该页面");
    return router.replace({ name: "welcome" });
  }

  return next();
});

export default router;
