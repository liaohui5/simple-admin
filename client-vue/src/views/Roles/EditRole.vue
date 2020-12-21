<template>
  <!-- 修改弹窗 -->
  <el-dialog title="提示" :visible.sync="show" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form :rules="rules" label-position="left" label-width="80px" :model="curEditRole">
      <el-form-item prop="role_name" label="角色名称">
        <el-input v-model="curEditRole.role_name"></el-input>
      </el-form-item>
      <el-form-item prop="desc" label="角色描述">
        <el-input
          type="textarea"
          max="100"
          :show-word-limit="true"
          :autosize="{ minRows: 5 }"
          resize="none"
          v-model="curEditRole.role_desc"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="update">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateRoleInfo } from "@/api/index";
export default {
  data: () => ({
    show: false,
    curEditRole: {},
    rules: {
      role_desc: [
        { required: true, message: "角色名称不能为空", trigger: "blur" },
        { pattern: /^[\u4e00-\u9fa5a-z_0-9.·-]+$/i, message: "角色名称不能包含特殊符号", trigger: "blur" }
      ],
      role_name: [
        { required: true, message: "角色描述不能为空", trigger: "blur" },
        { pattern: /^[\u4e00-\u9fa5a-z_0-9.·-]+$/i, message: "角色描述不能包含特殊符号", trigger: "blur" }
      ]
    }
  }),
  watch: {
    show(val) {
      if (!val) {
        this.curEditRole = {};
      }
    }
  },
  methods: {
    // 显示修改角色信息
    showDialog(row) {
      this.show = true;
      this.curEditRole = row;
    },

    // 修改角色信息
    async update() {
      const { id, role_name, role_desc } = this.curEditRole;
      if (!role_name || !role_desc) {
        this.$message.warning("角色名称和角色描述不能为空");
        return;
      }
      const res = await updateRoleInfo(id, { role_name, role_desc });
      if (res.success) {
        this.$message.success("修改成功");
        this.show = false;
      }
    }
  }
};
</script>
