import axios from "axios";
import $router from "@/router/index";
import beforeSend from "@/utils/beforeSend";
import { ElMessage } from "element-plus";

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json; charset=utf8",
  },
});

// 全局请求拦截器: 添加 token(如果登录) && 添加 signature
http.interceptors.request.use((config) => {
  beforeSend(config);
  return config;
});

// 全局响应拦截器
http.interceptors.response.use(
  ({ data: res, status }) => {
    if (status === 401) {
      ElMessage.info(res.msg || "请先登录");
      $router.push({ name: "Login" });
      return;
    }

    if (!res.success) {
      throw new Error(res.msg || "响应报错了");
    }

    return res.data;
  },
  (err) => {
    ElMessage.error(err.response.data.msg || "响应报错了");
    Promise.reject(err);
  }
);

export default http;
