import { request } from 'umi';

/**
 * 获取用户列表
 * @param params
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/users?id=%e7%94%a8%e6%88%b7%e5%88%97%e8%a1%a8
 * @returns
 */
export const getUsers = (params = {}) => () => {
  return request('/api/users', {
    method: 'get',
    params,
  });
};

/**
 * 创建用户信息
 * @param data
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/users?id=%e5%88%9b%e5%bb%ba%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af
 * @returns
 */
export const createUser = (data: ICreateUserItem) => () => {
  return request('/api/users', {
    method: 'post',
    data,
  });
};

/**
 * 修改用户信息
 * @param id
 * @param data
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/users?id=%e4%bf%ae%e6%94%b9%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af
 * @returns
 */
export const updateUserById = (id: number, data: object) => () => {
  return request(`/api/users/${id}`, {
    method: 'patch',
    data,
  });
};

/**
 * 删除用户
 * @param id
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/users?id=%e5%88%a0%e9%99%a4%e7%94%a8%e6%88%b7%e4%bf%a1%e6%81%af
 * @returns
 */
export const deleteUserById = (id: number) => () => {
  return request(`/api/users/${id}`, {
    method: 'delete',
  });
};

/**
 * 给用户分配角色
 * @param user_id
 * @param role_ids
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/users?id=%e7%bb%99%e7%94%a8%e6%88%b7%e5%88%86%e9%85%8d%e8%a7%92%e8%89%b2
 * @returns
 */
export const assignUserRoles = (user_id: number, role_ids: number[]) => () => {
  return request('/api/userroles', {
    method: 'post',
    data: { user_id, role_ids },
  });
};

/**
 * 修改用户状态(因为用的是修改用户信息的接口, 但是不是同一个组件, 所以写一个快捷方法, 但是接口还是同一个)
 * @param id 被修改用户的id
 * @param status 状态(0: 正常 1:锁定, 锁定后无法登陆)
 * @returns
 */
export const updateUserStatus = ({ id, status }: IUpdateStatusParams) => () => {
  return request(`/api/users/${id}`, {
    method: 'patch',
    data: { status },
  });
};
