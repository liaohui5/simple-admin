## base URL

> http://localhost:7001


## 数据签名

> 所有接口的数据都必须通过接口数据签名防止数据被篡改

- 具体代码: `/client/src/api/http.js`

- 客户端将需要传递的接口参数, 通过 `jsencrypt` 生成一个签名并存入到 http header 中字段名 `Client-Signature`

- 生成签名需要一对 RSA 1024bit 的秘钥, [在线生成](http://web.chacuo.net/netrsakeypair)

