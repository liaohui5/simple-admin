import http from "@/utils/http";

// 登录
export const login = (data) => http.post("/user/login", data);

// 修改密码
export const resetPassword = (data) => http.post("/user/update_password", data);

// 获取用户列表
export const getUsers = (params) => http.get("/users", {params});

// 创建用户信息
export const createUser = (data) => http.post("/users", data);
