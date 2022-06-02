import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { ElMessage } from "element-plus";
import { mapState } from "pinia";
import { useAuthStore } from "@/store/auth";

// nprogress options
NProgress.configure({
  showSpinner: false
});

const hasPermission = (path) => {
  const getters = mapState(useAuthStore, ["permissions"]);
  const permissions = getters.permissions();
  for (let item of permissions) {
    if (item.path === path) {
      return true;
    }
  }
  return false;
};

export const beforeEach = (to, $from, next) => {
  NProgress.start();

  // 不需要登录
  if (to.meta.isPublic) {
    return next();
  }


  // 检查登录
  const getters = mapState(useAuthStore, ["isLogin"]);
  if (!getters.isLogin()) {
    ElMessage.error("请先登录");
    return next({ name: "Login" });
  }

  // 检查权限
  if (!to.meta.dontCheckPermission && !hasPermission(to.path)) {
    ElMessage.error("没有权限访问该页面");
    return next({ name: "Welcome" });
  }

  return next();
};

export const afterEach = () => NProgress.done();
