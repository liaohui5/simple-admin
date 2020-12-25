<template>
  <div>
    <!-- 顶部导航 -->
    <el-breadcrumb class="top-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表单内容 -->
    <el-card class="box-card">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" style="width: 500px; padding-top:22px;">
        <el-form-item label="原密码" prop="old_password">
          <el-input v-model="form.old_password" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="form.new_password" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input v-model="form.confirm" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="update">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updatePassword } from "../../api";

export default {
  data() {
    return {
      rules: {
        old_password: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: this.checkPassword, trigger: "blur" }
        ],
        new_password: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { validator: this.checkPassword, trigger: "blur" }
        ],
        confirm: [
          { required: true, message: "请确认您的新密码", trigger: "blur" },
          { validator: this.checkConfirm, trigger: "blur" }
        ]
      },
      form: null
    };
  },

  created() {
    this.reset();
  },

  methods: {
    // 修改密码
    async update() {
      const res = await updatePassword(this.form);
      if (res.success) {
        this.$message.success("修改成功请重新登录");
        this.$store.commit("login/logout");
        this.$router.replace({ name: "login" });
      }
    },

    // 检查密码格式是否有误
    checkPassword(rule, value, callback) {
      const passwordReg = /^[a-z0-9_-]{6,16}$/i;
      if (!passwordReg.test(value)) {
        return callback(new Error("密码必须是6-18位字母,数字,下划线"));
      }
      callback();
    },

    // 检查重复密码是否有误
    checkConfirm(rule, value, callback) {
      const { new_password: newPassword } = this.form;
      if (newPassword === value) {
        return callback();
      }
      return callback(new Error("两次密码不一致"));
    },

    // 重置表单
    reset() {
      this.form = {
        old_password: "",
        new_password: "",
        confirm: ""
      };
    }
  }
};
</script>
