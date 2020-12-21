import http from "./http";

// 用户登录
export const login = data => http.post("/user/login", data);

// 获取用户信息
export const getUsers = params => http.get("/users", { params });

// 创建用户
export const createUser = data => http.post("/users", data);

// 修改用户信息
export const updateUserInfo = (id, data) => http.patch(`/users/${id}`, data);

// 获取所有角色信息
export const getRoles = () => http.get("/roles");

// 根据角色ID删除角色
export const deleteRoleById = id => http.delete(`/roles/${id}`);

// 修改角色信息
export const updateRoleInfo = (id, data) => http.patch(`/roles/${id}`, data);

// 获取权限信息
export const getPermissions = params => http.get("/permissions", { params });

// 分配角色
export const assignRoles = data => http.post("/userroles", data);

// 创建角色
export const createRole = data => http.post("/roles", data);

// 创建权限
export const createPermission = data => http.post("/permissions", data);

// 修改权限信息
export const updatePermission = (id, data) => http.patch(`/permissions/${id}`, data);

// 删除权限
export const deletePermission = id => http.delete(`/permissions/${id}`);

// 分配权限
export const assignPermissions = data => http.post("/roleperms", data);
