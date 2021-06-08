import axios from "axios";
import store from "@/store";
import { Message } from "element-ui";
import { JSEncrypt } from "jsencrypt";
import CryptoJS from "crypto-js";

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "",
  timeout: 3000
});

/**
 * 根据指定的算法生成 sign
 * !! 注意: 签名的私钥必须和服务端验证的公钥为一对
 * @param {*} config
 * @returns {String} 数据签名
 */
export const makeSignWithConfig = config => {
  const { baseURL, url, params, method, data } = config;
  const args = { url: `${baseURL}${url}`, method };
  if (data) args.data = data;
  if (params) {
    // 因为服务端是用query来接收的, 所以都是字符串,否则验证通不过
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
  return jsencrypt.sign(JSON.stringify(args), CryptoJS.SHA256, "sha256");
};

// 全局请求拦截器
http.interceptors.request.use(config => {
  const { authUser } = store.state.login;
  if (authUser && authUser.token) {
    config.headers["User-Token"] = authUser.token;
  }
  config.headers["Client-Signature"] = makeSignWithConfig(config);
  // console.info("Client-Signature", config.headers["Client-Signature"]);
  return config;
});

// 全局响应拦截器
http.interceptors.response.use(
  response => response.data,
  err => Message.error(err.response.data.msg || "响应报错了")
);

export default http;
