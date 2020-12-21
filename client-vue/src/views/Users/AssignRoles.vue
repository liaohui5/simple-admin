<template>
  <el-dialog title="提示" :visible.sync="show" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-checkbox-group v-model="checkedRoles">
      <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">{{ item.role_name }}</el-checkbox>
    </el-checkbox-group>

    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="assignRoles">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { assignRoles } from "@/api/index";
export default {
  data: () => ({
    show: false,
    checkedRoles: [],
    assignRoleUser: []
  }),
  watch: {
    show(val) {
      if (!val) this.checkedRoles = [];
    }
  },
  computed: {
    ...mapState("roles", ["roles"])
  },
  methods: {
    // 显示弹窗, 选中已经拥有的角色
    showDialog(row) {
      this.assignRoleUser = row;
      this.show = true;
      this.assignRoleUser.roles.forEach(item => this.checkedRoles.push(item.id));
    },

    // 分配角色
    async assignRoles() {
      const uid = this.assignRoleUser.id;
      const roles = this.checkedRoles;
      const res = await assignRoles({ user_id: uid, role_ids: roles });
      if (res.success) {
        this.show = false;
        this.$message.success("分配成功");
        this.$emit("refresh");
      }
    }
  }
};
</script>
