<template>
  <div class="register-container">
    <el-card class="register-card">
      <div slot="header" class="clearfix">
        <h2>登录</h2>
      </div>
      <el-form :rules="loginRules" :model="loginData" ref="loginForm" label-position="left" label-width="0px">
        <el-form-item prop="email">
          <el-input v-model="loginData.email" prefix-icon="el-icon-user" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginData.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="login">登录</el-button>
          <!-- <el-button type="text" size="small" @click="toRegister">没有账号? 去注册</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { login } from "../api/index";
export default {
  name: "login",
  data() {
    return {
      loginData: {
        email: "",
        password: ""
      },
      loginRules: {
        email: [{ validator: this.checkEmail, trigger: "blur" }],
        password: [{ validator: this.checkPassword, trigger: "blur" }]
      }
    };
  },

  methods: {
    // 检查邮箱是否有误
    checkEmail(rule, value, callback) {
      if (!value) return callback(new Error("请填写邮箱地址"));
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailReg.test(value)) {
        return callback(new Error("邮箱格式有误"));
      }
      callback();
    },

    // 检查密码格式是否有误
    checkPassword(rule, value, callback) {
      if (!value) return callback(new Error("密码不能为空"));
      const passwordReg = /^[a-z0-9_-]{6,16}$/i;
      if (!passwordReg.test(value)) {
        return callback(new Error("密码必须是6-18位字母,数字,下划线"));
      }
      callback();
    },

    // 登录: 先检查数据, 然后执行登录操作
    login() {
      this.$refs.loginForm.validate(async isPassed => {
        if (!isPassed) {
          this.$message.error("数据格式有误,请检查后再次尝试");
          return;
        }
        const res = await login(this.loginData);
        if (res.success) {
          this.$store.commit("login/login", res.data);
          this.$router.push({ name: "home" });
          this.$message.success("登录成功");
          return;
        }
        this.$message.error(res.msg);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.register-container {
  width: 100%;
  height: 100%;
  background: url("../assets/imgs/bg.jpg") no-repeat;
  background-size: cover;
  .register-card {
    width: 500px;
    background: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
