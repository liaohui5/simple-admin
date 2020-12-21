<template>
  <el-dialog title="提示" :visible.sync="show" :close-on-press-escape="false" :close-on-click-modal="false">
    <div>
      <el-form :rules="rules" label-position="left" label-width="80px" :model="newUserModel">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="newUserModel.username" max="16" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="newUserModel.email" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="newUserModel.password" type="password" max="16" />
        </el-form-item>
        <el-form-item prop="confirm" label="确认密码">
          <el-input v-model="newUserModel.confirm" type="password" max="16" />
        </el-form-item>
        <el-form-item label="用户头像(可选)">
          <UploadCropper :action="avatarUploadURL" :on-success="onUploadAvatarSuccess" :show-file-list="false">
            <img v-if="newUserModel.avatar" :src="newUserModel.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </UploadCropper>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createUser } from "@/api/index";
import UploadCropper from "./UploadCropper.vue";
export default {
  components: { UploadCropper },
  computed: {
    // 头像上传地址
    avatarUploadURL() {
      return process.env.VUE_APP_AVATAR_UPLOAD_URL || "";
    }
  },
  data() {
    return {
      show: false,
      rules: {
        username: [{ validator: this.checkUsername, trigger: "blur" }],
        email: [{ validator: this.checkEmail, trigger: "blur" }],
        password: [{ validator: this.checkPassword, trigger: "blur" }],
        confirm: [{ validator: this.checkConfirm, trigger: "blur" }]
      },
      newUserModel: {
        username: "",
        email: "",
        avatar: "",
        password: "",
        confirm: ""
      }
    };
  },
  watch: {
    show(val) {
      if (!val) {
        this.newUserModel = {
          username: "",
          email: "",
          avatar: "",
          password: "",
          confirm: ""
        };
      }
    }
  },

  methods: {
    // 检查用户名是否可用
    checkUsername(rule, value, callback) {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      const reg = /^[_0-9a-z\u4e00-\u9fa5]{1,16}$/i;
      if (!reg.test(value)) {
        return callback(new Error("用户名格式有误"));
      }
      return callback();
    },

    // 检查邮箱是否有误
    checkEmail(rule, value, callback) {
      if (!value) {
        return callback(new Error("请填写邮箱地址"));
      }
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailReg.test(value)) {
        return callback(new Error("邮箱格式有误"));
      }
      callback();
    },

    // 检查密码格式是否有误
    checkPassword(rule, value, callback) {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      const passwordReg = /^[a-z0-9_-]{6,16}$/i;
      if (!passwordReg.test(value)) {
        return callback(new Error("密码必须是6-18位字母,数字,下划线"));
      }
      callback();
    },

    // 检查重复密码
    checkConfirm(rule, value, callback) {
      if (!value) {
        return callback(new Error("确认密码不能为空"));
      }
      if (value !== this.newUserModel.password) {
        return new callback(new Error("两次密码不一致"));
      }
      callback();
    },

    // 展示dialog
    showDialog() {
      this.show = true;
    },

    // 添加用户
    async addUser() {
      const res = await createUser(this.newUserModel);
      if (res.success) {
        this.show = false;
        this.$message.success("添加成功");
        this.$emit("refresh");
      }
    },

    // 上传成功
    onUploadAvatarSuccess(res) {
      this.newUserModel.avatar = res.data.url;
    }
  }
};
</script>
