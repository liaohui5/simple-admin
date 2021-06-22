// 搜索参数
interface ISearchParams {
  page: number;
  size: number;
  type?: number | string;
  desc?: string;
  content?: string;
}

// 更新状态参数
interface IUpdateStatusParams {
  id: number;
  status: number;
}

// umi-request requestInterceptors config
interface IRequestInterceptorConfig {
  url: string;
  method: string;
  data: object;
  params: object;
}

// 发送请求时, 生成sign的参数
interface IRequestSignArgs {
  url: string;
  method: string;
  data?: {
    [propName: string]: numstr;
  };
  params?: {
    [propName: string]: numstr;
  };
}

// 登录数据
interface ILoginAccount {
  email: string;
  password: string;
}

// 创建权限
interface ICreatePermissionItem {
  type: number;
  desc: string;
  pid: number;
  [propName: string]: numstr;
}

// 创建角色
interface ICreateRoleItem {
  role_name: string;
  role_desc: string;
}

// 创建用户
interface ICreateUserItem {
  username: string;
  email: string;
  password: string;
  [propName: string]: string;
}
