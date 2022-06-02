<template>
  <div>
    <breadcrumb :paths="['修改密码']" />
    <div class="main-content">
      <el-form
        :model="formData"
        :rules="formRule"
        label-width="10rem"
        label-position="left"
        class="form-wrapper"
      >
        <el-form-item label="当前密码" prop="old_password">
          <el-input v-model="formData.old_password" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="formData.new_password" type="password" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirm_password">
          <el-input v-model="formData.confirm_password" type="password" />
        </el-form-item>
        <el-form-item class="mb-0">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button type="danger" native-type="reset" @click="resetFormData"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { resetPassword } from "@/api";
import { useAuthStore } from "@/store/auth.js";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const $router = useRouter();

const formData = reactive({
  old_password: "",
  new_password: "",
  confirm_password: "",
});

// 重置表单数据
function resetFormData() {
  formData.new_password = "";
  formData.old_password = "";
  formData.confirm_password = "";
}

// 提交表单
async function submitForm() {
  await resetPassword(formData);
  authStore.logout();
  $router.replace({ name: "Login" });
}

// 表单验证规则
const formRule = {
  old_password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      type: "string",
      pattern: /^[a-z0-9_-]{6,16}$/i,
      message: "密码有误",
      trigger: "change",
    },
  ],
  new_password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      type: "string",
      pattern: /^[a-z0-9_-]{6,16}$/i,
      message: "密码格式有误: 必须6-16位",
      trigger: "change",
    },
  ],
  confirm_password: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    {
      trigger: "change",
      validator: function (field, value, callback) {
        if (value === formData.new_password) {
          callback();
        } else {
          callback(new Error("两次密码不一致"));
        }
      },
    },
  ],
};
</script>

<style lang="less" scoped>
.form-wrapper {
  width: 55rem;
  padding-top: 2rem;
}
</style>
