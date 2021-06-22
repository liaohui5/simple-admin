import { request } from 'umi';

/**
 * 获取所有权限信息(分页)
 * @param params
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/permissions?id=%e6%9d%83%e9%99%90%e5%88%97%e8%a1%a8
 * @returns
 */
export const getPermissions = (params: ISearchParams) => () => {
  return request('/api/permissions', {
    method: 'get',
    params,
  });
};

/**
 * 获取所有权限, 并且生成树形数据(无分页)
 * @returns
 */
export const getPermissionTree = () => {
  return request('/api/permissions', {
    method: 'get',
    params: { type: 2 },
  });
};

/**
 * 创建权限信息
 * @param data 权限数据
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/permissions?id=%e5%88%9b%e5%bb%ba%e6%9d%83%e9%99%90%e4%bf%a1%e6%81%af
 * @returns
 */
export const createPermission = (data: ICreatePermissionItem) => () => {
  return request('/api/permissions', {
    method: 'post',
    data,
  });
};

/**
 * 修改权限信息
 * @param id 被修改的权限ID
 * @param data 权限信息
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/permissions?id=%e4%bf%ae%e6%94%b9%e6%9d%83%e9%99%90%e4%bf%a1%e6%81%af
 * @returns
 */
export const updatePermInfo = (id: numstr, data: object) => () => {
  return request(`/api/permissions/${id}`, {
    method: 'patch',
    data,
  });
};

/**
 * 修改权限状态(快捷方法)
 * @param param0 {id: 权限id, status: 权限状态}
 * @returns
 */
export const updatePermStatus = ({ id, status }: IUpdateStatusParams) => () => {
  return request(`/api/permissions/${id}`, {
    method: 'patch',
    data: { status },
  });
};

/**
 * 删除权限
 * @param id 权限ID
 * @returns
 */
export const deletePermById = (id: numstr) => () => {
  return request(`/api/permissions/${id}`, {
    method: 'delete',
  });
};
