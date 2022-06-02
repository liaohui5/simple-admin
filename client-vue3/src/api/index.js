import http from "@/utils/http";

// 登录
export const login = (data) => http.post("/user/login", data);

// 修改密码
export const resetPassword = (data) => http.post("/user/update_password", data);
