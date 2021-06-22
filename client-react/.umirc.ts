import { defineConfig } from 'umi';
import routes from "./config/routes";

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  request: {
    dataField: '',
  },
  fastRefresh: {},
  define: {
    // 定义环境变量:
    apiBaseURL: 'http://localhost:7001',
    avatarUploadURL: 'http://localhost:7001/upload/avatar',
  },
});
