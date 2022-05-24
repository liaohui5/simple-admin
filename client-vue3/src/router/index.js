import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/login/index.vue";
import Main from "@/views/main/index.vue";
import User from "@/views/user/index.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    component: Main,
    children: [
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

export default router;
