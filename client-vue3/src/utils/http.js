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
http.interceptors.request.use((config) => beforeSend(config));

// 全局响应拦截器
http.interceptors.response.use(
  ({ data: res }) => {
    if (!res.success) {
      throw new Error(res.msg || "响应报错了");
    }
    return res.data;
  },
  (err) => {
    console.log('[axios-error]: ', err);
    const errMsg = err.response.data.msg;
    if (err.response.status === 401) {
      ElMessage.info(errMsg || "请先登录");
      $router.push({ name: "Login" });
      return;
    }
    ElMessage.error(errMsg || "响应报错了");
    Promise.reject(err);
  }
);

export default http;
