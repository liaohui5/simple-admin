<template>
  <el-dialog title="提示" :visible.sync="show" :close-on-press-escape="false" :close-on-click-modal="false">
    <div>
      <el-form :rules="rules" label-position="left" label-width="80px" :model="newRoleModel">
        <el-form-item prop="role_name" label="角色名称">
          <el-input v-model="newRoleModel.role_name" max="16" />
        </el-form-item>
        <el-form-item prop="role_desc" label="角色描述">
          <el-input v-model="newRoleModel.role_desc" max="32" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="addRole">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createRole } from "@/api/index";
export default {
  data: () => ({
    show: false,
    rules: {
      role_desc: [
        { required: true, message: "角色名称不能为空", trigger: "blur" },
        { pattern: /^[\u4e00-\u9fa5a-z_0-9.·-]+$/i, message: "角色名称不能包含特殊符号", trigger: "blur" }
      ],
      role_name: [
        { required: true, message: "角色描述不能为空", trigger: "blur" },
        { pattern: /^[\u4e00-\u9fa5a-z_0-9.·-]+$/i, message: "角色描述不能包含特殊符号", trigger: "blur" }
      ]
    },
    newRoleModel: {
      role_name: "",
      role_desc: ""
    }
  }),
  watch: {
    show(val) {
      if (!val) {
        this.newRoleModel = {
          role_name: "",
          role_desc: ""
        };
      }
    }
  },

  methods: {
    // 展示dialog
    showDialog() {
      this.show = true;
    },

    // 添加角色
    async addRole() {
      const res = await createRole(this.newRoleModel);
      if (res.success) {
        this.show = false;
        this.$message.success("添加成功");
        this.$store.dispatch("roles/getRoles");
      }
    }
  }
};
</script>
