/**
 * 所有可复用的表单验证规则
 */

// 检查邮箱
export const checkEmailRules = [
  { required: true, message: "邮箱不能为空", trigger: "blur" },
  {
    type: "string",
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: "邮箱格式有误",
    trigger: "change",
  },
];

// 检查用户密码
export const checkPasswordRules = [
  { required: true, message: "密码不能为空", trigger: "blur" },
  {
    type: "string",
    pattern: /^[a-z0-9_-]{6,16}$/i,
    message: "密码格式有误: 必须6-16位",
    trigger: "change",
  },
];
