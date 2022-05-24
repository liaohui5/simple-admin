<template>
  <div class="login-page" :style="{ background: bgColor }">
    <el-card class="login-card">
      <template #header>
        <h2 class="card-header flex align-center">登录</h2>
      </template>

      <!-- login form -->
      <el-form
        ref="loginFormRef"
        :rules="loginRules"
        :model="loginForm"
        label-position="left"
        size="large"
      >
        <el-form-item label="" prop="email">
          <el-input v-model="loginForm.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { reactive, ref, toRaw, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.js";

export default defineComponent({
  setup() {
    const $router = useRouter();
    const authStore = useAuthStore();

    const loginFormRef = ref();
    const loginForm = reactive({
      email: "admin@qq.com",
      password: "123456",
    });
    const loginRules = {
      email: [
        { required: true, message: "邮箱不能为空", trigger: "blur" },
        {
          type: "string",
          pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          message: "邮箱格式有误",
          trigger: "change",
        },
      ],
      password: [
        { required: true, message: "密码不能为空", trigger: "blur" },
        {
          type: "string",
          pattern: /^[a-z0-9_-]{6,16}$/i,
          message: "密码格式有误: 必须6-16位",
          trigger: "change",
        },
      ],
    };

    // 提交表单
    const submit = async () => {
      // 验证
      await loginFormRef.value.validate(async (isPass) => {
        if (!isPass) return;
        await authStore.login(toRaw(loginForm));
        $router.replace({ path: "/" });
      });
    };

    // 获取随机渐变背景颜色
    function getRandomBgColor() {
      const randomInArray = (arr) => {
        const index = Math.floor(Math.random() * arr.length);
        return arr[index];
      };
      const dirs = ["left", "right", "top", "bottom"];
      const colors = [
        "#a8c0ff, #3f2b96",
        "#4e54c8, #8f94fb",
        "#355c7d, #6c5b7b, #c06c84",
        "#fc5c7d, #6a82fb",
        "#108dc7, #ef8e38",
      ];
      const dir = randomInArray(dirs);
      const color = randomInArray(colors);
      return `linear-gradient(to ${dir}, ${color})`;
    }
    const bgColor = getRandomBgColor();

    return {
      loginForm,
      loginFormRef,
      submit,
      loginRules,
      bgColor,
    };
  },
});
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
}
</style>
