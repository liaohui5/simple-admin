<template>
  <div>
    <!-- 顶部导航 -->
    <el-breadcrumb class="top-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体内容 -->
    <el-card class="box-card">
      <div class="top-search-wrapper" style="margin-bottom: 20px">
        <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
      </div>
      <el-table :data="roles" border>
        <el-table-column prop="id" label="角色ID" />
        <el-table-column prop="role_name" label="角色名称" />
        <el-table-column prop="role_desc" label="角色描述" />
        <el-table-column label="角色拥有的权限">
          <template scope="scope">
            <!-- filter: 不显示顶级的权限 -->
            <el-tag
              v-for="item in scope.row.permissions.filter(p => p.pid > 0)"
              :key="item.id"
              :type="item.type === 0 ? 'primary' : 'success'"
              size="mini"
              style="margin: 0 5px 0 5px"
            >
              {{ item.desc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="mini" type="primary" @click="showEditRoleDialog(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteRole(scope.row)">删除</el-button>
            <el-button size="mini" type="success" @click="showAssignDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户 -->
    <add-roles ref="add-roles" />

    <!-- 编辑角色信息 -->
    <edit-role ref="edit-role" />

    <!-- 分配权限 -->
    <assign-permissions ref="assign-rights" @refresh="getRoles" />
  </div>
</template>

<script>
import { deleteRoleById } from "@/api/index";
import { mapState, mapActions } from "vuex";
import AddRoles from "./Roles/AddRoles.vue";
import EditRole from "./Roles/EditRole.vue";
import AssignPermissions from "./Roles/AssignPermissions";

export default {
  components: { AddRoles, EditRole, AssignPermissions },
  created() {
    this.getRoles();
  },
  data: () => ({
    curEditRole: {} // 当期啦被修改的角色信息
  }),
  computed: {
    ...mapState("roles", ["roles"])
  },
  methods: {
    ...mapActions("roles", ["getRoles"]),

    // 添加角色
    showAddRoleDialog() {
      this.$refs["add-roles"].showDialog();
    },

    // 修改角色信息
    showEditRoleDialog(row) {
      this.$refs["edit-role"].showDialog(row);
    },

    // 分配权限
    showAssignDialog(row) {
      this.$refs["assign-rights"].showDialog(row);
    },

    // 删除角色
    deleteRole(row) {
      return this.$confirm("删除后, 会影响已经分配该角色的用户权限, 确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await deleteRoleById(row.id);
          if (res.success) {
            this.$store.dispatch("roles/getRoles");
            this.$message.success("删除成功");
          }
        })
        .catch(() => {});
    }
  }
};
</script>
