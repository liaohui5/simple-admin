<template lang="pug">
.login-page(:style="{ background: bgColor }")
  el-card.login-card
    template(#header)
      h2.card-header.flex.align-center 登录
    el-form(ref="loginFormRef" :rules="loginRules" :model="loginForm" label-position="left" size="large")
      el-form-item(label="" prop="email")
        el-input(v-model="loginForm.email" placeholder="邮箱")
      el-form-item(label="" prop="password")
        el-input(v-model="loginForm.password" type="password" placeholder="密码")
      el-form-item(label="")
        el-button(type="primary" @click="submit") 登录
</template>

<script setup>
import { reactive, ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.js";
import { checkEmailRules, checkPasswordRules } from "@/utils/formCheckRules";
import { getRandomBgColor } from "@/utils/tools";

const $router = useRouter();
const authStore = useAuthStore();

const loginFormRef = ref();
const loginForm = reactive({
  email: "admin@qq.com",
  password: "123456",
});

// 表单规则不会改变, 所以不需要响应式数据
const loginRules = {
  email: checkEmailRules,
  password: checkPasswordRules,
};

// 提交表单
const submit = () => {
  // 验证通过才提交
  loginFormRef.value.validate(async (isPass) => {
    if (!isPass) return;
    await authStore.login(toRaw(loginForm));
    $router.replace({ path: "/" });
  });
};

const bgColor = getRandomBgColor();
</script>

<style lang="less" scoped>
.login-page {
  // background: linear-gradient(to right, #3f2b96, #a8c0ff);
  height: 100%;
  .login-card {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45rem;
    font-size: 1.8rem;
  }
  .card-header {
    margin: 0.5rem 0;
  }
}
</style>
