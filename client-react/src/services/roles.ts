import { request } from 'umi';

/**
 * 获取所有角色
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/roles?id=%e8%a7%92%e8%89%b2%e5%88%97%e8%a1%a8
 * @returns
 */
export const getRoles = () => request('/api/roles', { method: 'get' });

/**
 * 根据ID删除角色
 * @param id
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/roles?id=%e5%88%a0%e9%99%a4%e8%a7%92%e8%89%b2%e4%bf%a1%e6%81%af
 * @returns
 */
export const deleteRoleById = (id: string | number) => () => {
  return request(`/api/roles/${id}`, {
    method: 'delete',
  });
};

/**
 * 创建角色信息
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/roles?id=%e5%88%9b%e5%bb%ba%e8%a7%92%e8%89%b2%e4%bf%a1%e6%81%af
 * @param data
 * @returns
 */
export const createRole = (data = {}) => () => {
  return request(`/api/roles`, {
    method: 'post',
    data,
  });
};

/**
 * 修改角色信息
 * @param data
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/roles?id=%e4%bf%ae%e6%94%b9%e8%a7%92%e8%89%b2%e4%bf%a1%e6%81%af
 * @returns
 */
export const updateRole = (id: numstr, data: ICreateRoleItem) => () => {
  return request(`/api/roles/${id}`, {
    method: 'patch',
    data,
  });
};

/**
 * 给角色分配权限
 * @param roleId 角色ID
 * @param ids 权限ID
 * @docs https://liaohui5.gitee.io/simple-admin/#/api/roles?id=%e7%bb%99%e8%a7%92%e8%89%b2%e5%88%86%e9%85%8d%e6%9d%83%e9%99%90
 * @returns
 */
export const assignPermissions = (roleId: numstr, ids: number[]) => () => {
  return request('/api/roleperms', {
    method: 'post',
    data: {
      role_id: roleId,
      permission_ids: ids,
    },
  });
};
