'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const { user, upload, assign, role, permission } = controller;
  const { sign, auth, rbac } = middleware;

  // 是否开启API签名验证
  const enableRSAChecker = true;

  // 注意中间件的执行顺序
  const checks = enableRSAChecker ? [sign(), auth(), rbac()] : [auth(), rbac()];

  // 测试
  // router.get('/api/test', upload.test);

  // 登录
  if (enableRSAChecker) {
    router.post('/api/user/login', sign(), user.login);
    // 修改密码(不需要验证权限: 任何用户都可以修改自己的账户密码)
    router.post(
      '/api/user/update_password',
      sign(),
      auth(),
      user.updatePassword
    );
  } else {
    router.post('/api/user/login', user.login);
    // 修改密码(不需要验证权限: 任何用户都可以修改自己的账户密码)
    router.post('/api/user/update_password', auth(), user.updatePassword);
  }

  // 头像上传
  router.post('/upload/avatar', upload.avatar);

  // 给用户分配角色
  router.post('/api/userroles', ...checks, assign.assignRoles);

  // 给角色分配权限
  router.post('/api/roleperms', ...checks, assign.assignPermis);

  // 用户
  router.resources('users', '/api/users', ...checks, user);

  // 角色
  router.resources('roles', '/api/roles', ...checks, role);

  // 权限
  router.resources('permissions', '/api/permissions', ...checks, permission);
};
