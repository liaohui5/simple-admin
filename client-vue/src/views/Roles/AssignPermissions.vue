<template>
  <el-dialog title="提示" :visible.sync="show" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-tree
      node-key="id"
      ref="tree"
      :data="permissionTree"
      :default-expand-all="true"
      :show-checkbox="true"
      :props="treeProps"
    >
      <div class="node-item-wrapper" slot-scope="scope">
        <div>{{ scope.node.label }}</div>
        <div v-if="scope.data.pid === 0">
          <el-tag :type="scope.data.type === 0 ? 'primary' : 'success'" size="mini">
            {{ scope.data.type === 0 ? "路由权限" : "API权限" }}
          </el-tag>
        </div>
      </div>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="assignPermissions">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { assignPermissions } from "@/api/index";
export default {
  created() {
    this.$store.dispatch("permissions/getPermissionTree");
  },
  data: () => ({
    show: false,
    currentRole: {}, // 当前被分配的角色
    treeProps: {
      label: "desc",
      children: "children"
    }
  }),
  computed: {
    ...mapState("permissions", ["permissionTree"])
  },
  methods: {
    // 显示弹窗, 选中已经拥有的角色
    showDialog(row) {
      this.currentRole = row;
      this.show = true;
      const checkedKeys = row.permissions.map(item => item.id);
      this.$nextTick(() => this.$refs.tree.setCheckedKeys(checkedKeys));
    },

    // 分配权限
    async assignPermissions() {
      const data = {
        role_id: this.currentRole.id,
        permission_ids: this.$refs.tree.getCheckedKeys()
      };
      const res = await assignPermissions(data);
      if (res.success) {
        this.$message.success("分配成功");
        this.show = false;
        this.$emit("refresh");
      }
    }
  }
};
</script>

<style lang="scss">
.node-item-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
