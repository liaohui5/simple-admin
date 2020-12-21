<template>
  <el-dialog title="提示" :visible.sync="show" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form label-position="left" label-width="80px" :model="currEditUser">
      <el-form-item label="用户名">
        <el-input v-model="currEditUser.username" max="16" />
      </el-form-item>
      <el-form-item label="用户邮箱">
        <el-input v-model="currEditUser.email" />
      </el-form-item>
      <el-form-item label="用户头像">
        <UploadCropper :action="avatarUploadURL" :on-success="onUploadAvatarSuccess" :show-file-list="false">
          <img v-if="currEditUser.avatar" :src="currEditUser.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </UploadCropper>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="updateUserInfo(currEditUser.id, currEditUser)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateUserInfo } from "@/api/index";
import UploadCropper from "./UploadCropper";

export default {
  components: { UploadCropper },
  data: () => ({
    show: false,
    currEditUser: {} // 当前被修改的用户
  }),
  computed: {
    // 头像上传地址
    avatarUploadURL() {
      return process.env.VUE_APP_AVATAR_UPLOAD_URL || "";
    }
  },
  methods: {
    // 显示修改信息dialog
    showDialog(row) {
      this.currEditUser = row;
      this.show = true;
    },

    // 修改用户信息
    async updateUserInfo(id, data) {
      const res = await updateUserInfo(id, data);
      if (res.success) {
        this.$message.success("修改成功");
        this.show = false;
        this.$emit("refresh");
      }
    },

    // 上传成功
    onUploadAvatarSuccess(res) {
      this.currEditUser.avatar = res.data.url;
    }
  }
};
</script>
