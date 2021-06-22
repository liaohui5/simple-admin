import { request } from 'umi';

/**
 * 登录
 * @param data
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/users?id=%e7%99%bb%e5%bd%95
 * @returns
 */
export const login = (data: ILoginAccount) => () => {
  return request('/api/user/login', {
    method: 'post',
    data,
  });
};
