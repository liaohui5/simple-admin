import JSEncrypt from 'jsencrypt/bin/jsencrypt';
import { SHA256 } from 'crypto-js';
import { persistStore, persistReducer } from 'redux-persist';
import { getDvaApp, RequestConfig } from 'umi';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createFilter from 'redux-persist-transform-filter';

const loginPath = '/login';

export const dva = {
  config: {
    onError(e: MouseEvent) {
      e.preventDefault();
    },
    onReducer(reducer: any) {
      const globalCollapsedFilter = createFilter('global', ['collapsed']);
      const persistConfig = {
        key: 'root',
        storage,
        whitelist: ['login'],
        transforms: [globalCollapsedFilter],
        stateReconciler: autoMergeLevel2,
      };
      return persistReducer(persistConfig, reducer);
    },
  },
};

// 将本地的数据同步到dva的model状态中
window.addEventListener('DOMContentLoaded', () => {
  const app = getDvaApp();
  persistStore(app._store);
});

/**
 * 配置 plugin-initial-state 插件
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * @returns
 */
// export const getInitialState = () => {
//   const authUser = window.localStorage.get('auth-user');
//   if (history.location.pathname === loginPath) {
//     return { authUser: null };
//   }
//   return { authUser };
// };

/**
 * 配置 umi-request
 */
export const request: RequestConfig = {
  // prefix: 'http://127.0.0.1:7001',
  prefix: apiBaseURL,
  timeout: 3000,
  requestType: 'json',
  errorConfig: {
    adaptor: (res) => {
      return {
        ...res,
        success: res.success,
        errorMessage: res.msg,
      };
    },
  },
  middlewares: [],
  requestInterceptors: [
    // 如果有token, 携带 token
    (url: string, config: any) => {
      let authUser: any = window.localStorage.getItem('auth-user');
      try {
        authUser = JSON.parse(authUser);
        config.headers['User-Token'] = authUser.token;
      } catch (e) {
        console.error('[app.tsx]:74 请求出错了...');
      }
    },

    // 加密数据
    (url: string, config:any) => {
      config.url = url;
      const { params, method, data = {} } = config;
      const args: IRequestSignArgs = { url, method };
      if (Object.keys(data).length) args.data = data;
      if (Object.keys(params).length) {
        args.params = {};
        for (let key in params) {
          args.params[key] = params[key].toString();
        }
      }
      const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDA/SVT71FB1DABDW41oq6I7vBa9IcFNuEKnIVcLTZmnGfj5hx5
Z1f1IkKdNj1YYFhMh5PxsYREd+uUHVwljDR9ZnPxcy0PNyMGaUiwkYBfrJ7W2K/B
hJiYXsKcFjJt5/ZNc4V3I6hO5hvw0LNaa2La4p9zgXCiI6ytT4k5e1shoQIDAQAB
AoGAAwokV0HfQRmCPkWOU30Mr5Wq9M5z0trBwfhcskAU8NMFYMP7StRxpDYZtSmF
wrexwau1cJjf1nGRiIjLLofFPLxu4+SYWjUIlcrUC9ntA3/x/YUdycy582RP/JrY
QVI5VU2RcFbjgWDVkmdbFLfKCPVJFxOzTk93j8sNBSruxokCQQD/T64uAR6nPacW
FFNM7QPWuIgNOdp+fxlXwM4de1vzgJDW5AhRQYMoyGPUQ4viKJBmszJYdyD2doJQ
d5U4af8bAkEAwYJs18Q9C8JH7+5P/heNT0ZWSo6yUYBArzNmNTyDQjo4x0T55qqg
/3Jh7uWCijLGi/Ljb+udCZXOo+5Cjsqh8wJBAK4FI5Xb0YbwsPiNthGS47DxalqJ
enIKM73qfxL9SDl7Aj5Wg4zO+JVNsS23NJtcRsCZl9FQsbkMIdqzB5TCOs0CQAvR
DRh38UpgiMgMA3J+ubBXmTlgUV9Mt6Z7OwiRM2q9522ztpbxYHd44qYV+cy6oQk2
wdC50JMfRMkZ6ZKSqSUCQHQrJ2chU4Ims/4VVG/23k/eRmyjQDgAfTMw+XTVA2HF
MrbS/QSAWgxBr7LUhgelbYYAhGujA6LjOzL+m1NyS4k=
-----END RSA PRIVATE KEY-----`;
      const jsencrypt = new JSEncrypt();
      jsencrypt.setPrivateKey(privateKey);
      console.info('---request args ---', JSON.stringify(args));
      const sign = jsencrypt.sign(JSON.stringify(args), SHA256, 'sha256');
      config.headers['Client-Signature'] = sign;
    },
  ],
  responseInterceptors: [],
};
