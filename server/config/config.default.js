/* eslint valid-jsdoc: "off" */

'use strict';

const db = require('./database');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'app_key_secret';

  // add your middleware config here
  config.middleware = [];

  // 数据库链接
  config.sequelize = db;

  // 不开启 csrf 验证
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 允许跨域
  config.cors = {
    // origin: ['http://localhost:8080'],
    origin: '*',
    keepHeadersOnError: true,
    allowMethods: 'GET,HEAD,POST,PUT,DELETE,PATCH,OPTIONS',
    allowHeaders: [
      'Accept',
      'Content-Type',
      'Client-Signature',
      'User-Token',
      'x-requested-with',
    ],
  };

  // 文件上传配置
  config.multipart = {
    fileSize: '2mb',
    whitelist: ['.jpg', '.jpeg', '.png', '.gif'],
  };

  // 异常处理
  config.onerror = {
    // 代码异常时, 执行这个处理函数, 其他函数不会生效
    // all(){}

    // 当请求头中没有: Accept: application/json 时执行
    html(e, ctx) {
      ctx.body = `<h1>服务端报错了...</h1><p>${e.message}<p>`;
    },

    // 当请求头中有: Accpet: application/json 时候执行, 用于接口的错误处理
    json(e, ctx) {
      // eslint-disable-next-line no-proto
      if (e.__proto__.constructor.name === 'UnprocessableEntityError') {
        return ctx.error(422, e.errors[0].message); // 处理 egg-validate 抛的异常
      }
      return ctx.error(500, e.message);
    },
  };

  // 自定义配置
  const userConfig = {
    // myAppName: 'egg',
  };

  return { ...config, ...userConfig };
};
