// 用户列表对象
interface IUserItem {
  id: number;
  username: string;
  email: string;
  avatar: string;
  status: number;
  created_at: string;
  roles: Array<IRoleItem>;
}

// 登录用户信息
interface IAuthUser extends IUserItem {
  readonly token: string;
  permissions: Array<IPermissionItem>;
}

// 角色
interface IRoleItem {
  id: number;
  role_name: string;
  permissions?: Array<IPermissionItem>;
}

// 侧边菜单栏
interface IMenuItem {}

// 权限
interface IPermissionItem {
  id: number;
  desc: string;
  type: numstr;
  method: null | string;
  icon: string;
  path: string;
  status: number;
  pid: number;
}

// 权限树(所有权限不分页的树形结构数据)
interface IPermissionTreeItem extends IPermissionItem {
  children?: Array<IPermissionItem>;
  key?: string;
  title?: string;
}

// 全局响应格式
interface IBaseResponse {
  readonly code: number;
  readonly success: boolean;
  readonly msg: string;
  data: any;
} 

// 普通大多数的的响应
interface IResponse<T> extends IBaseResponse {
  data: T;
}

// 全局分页响应data
interface IPaginationResponseData<T> {
  count: number;
  rows: T[];
}

// 全局分页响应格式
interface IPaginationResponse<T> extends IBaseResponse {
  data: IPaginationResponseData<T>;
}
