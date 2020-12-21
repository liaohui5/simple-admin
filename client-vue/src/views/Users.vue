<template>
  <div>
    <!-- 顶部导航 -->
    <el-breadcrumb class="top-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体内容 -->
    <el-card class="box-card">
      <!-- 顶部搜索 -->
      <div class="top-search-wrapper">
        <el-form :inline="true" :model="searchModel">
          <el-form-item>
            <el-input placeholder="请输入内容" v-model="searchModel.content" style="width:500px">
              <el-select v-model="searchModel.type" style="width: 150px" slot="prepend" placeholder="请选择搜索内容">
                <el-option label="用户ID" value="1"></el-option>
                <el-option label="用户名" value="2"></el-option>
                <el-option label="用户邮箱" value="3"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="success" @click="showAddUserDialog">添加用户</el-button>
        </div>
      </div>

      <!-- 表格数据 -->
      <el-table :data="tableData.rows" border>
        <el-table-column prop="id" label="UID" />
        <el-table-column prop="avatar" label="头像">
          <template scope="scope">
            <img :src="scope.row.avatar" style="width:50px;" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱地址" />
        <el-table-column label="用户角色">
          <template scope="scope">
            <el-tag v-for="item in scope.row.roles" size="small" :key="item.id">{{ item.role_name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间">
          <template scope="scope">
            {{ scope.row.created_at | datetime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="用户状态">
          <template scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="success">正常</el-tag>
            <el-tag v-else size="small" type="danger">锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template scope="scope">
            <el-button type="primary" size="mini" @click="showEditUserDialog(scope.row)">修改</el-button>
            <el-button type="warning" size="mini" @click="showAssigRolesDialog(scope.row)">分配角色</el-button>
            <el-button type="danger" v-if="scope.row.status === 0" size="mini" @click="changeUserStatus(scope.row)"
              >锁定</el-button
            >
            <el-button type="success" v-else size="mini" @click="changeUserStatus(scope.row)">解锁</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          :page-size="pagination.size"
          :page-sizes="[10, 20, 30]"
          :total="tableData.count"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 修改用户信息 -->
    <edit-user :showEditUserDialog.sync="showEditUserDialog" @refresh="getUsers" ref="edit-user" />

    <!-- 添加用户 -->
    <add-user ref="add-user" @refresh="getUsers" />

    <!-- 分配角色 -->
    <assign-roles ref="assign-roles" @refresh="getUsers" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUsers } from "../api/index";
import EditUser from "./Users/EditUser.vue";
import AddUser from "./Users/AddUser.vue";
import AssignRoles from "./Users/AssignRoles.vue";

export default {
  components: { EditUser, AddUser, AssignRoles },
  created() {
    this.getUsers();
    this.$store.dispatch("roles/getRoles");
  },
  data: () => ({
    tableData: {
      rows: [],
      count: 0
    },
    pagination: {
      page: 1,
      size: 10
    },
    searchModel: {
      type: "", // 1:ID 2:用户名 3:邮箱
      content: ""
    }
  }),

  computed: {
    ...mapState("roles", ["roles"])
  },

  methods: {
    // 显示: 添加用户弹窗
    showAddUserDialog() {
      this.$refs["add-user"].showDialog();
    },

    // 显示: 修改用户信息弹窗
    showEditUserDialog(row) {
      this.$refs["edit-user"].showDialog(row);
    },

    // 显示: 分配角色弹窗
    showAssigRolesDialog(row) {
      this.$refs["assign-roles"].showDialog(row);
    },

    // 修改用户状态
    changeUserStatus(row) {
      const status = row.status === 1 ? 0 : 1;

      // 解锁
      if (status === 0) {
        this.$refs["edit-user"].updateUserInfo(row.id, { status })
        return;
      }

      // 锁定: 先确认
      return this.$confirm("锁定后,该用户无法登陆,确定要锁定吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => this.$refs["edit-user"].updateUserInfo(row.id, { status }))
        .catch(() => {});
    },

    // 获取用户(组合分页参数和搜索参数)
    async getUsers() {
      let query = { ...this.pagination };
      const { type, content } = this.searchModel;
      if (type && content) {
        query = { ...query, ...this.searchModel };
      }
      const res = await getUsers(query);
      if (res.success) {
        this.tableData = res.data;
      }
    },

    // 搜索用户
    async search() {
      const { type, content } = this.searchModel;
      if (!type) {
        this.$message.warning("请选择搜索类型");
        return;
      }

      if (!content) {
        this.$message.warning("请输入搜索内容");
        return;
      }
      this.changePage(1);
    },

    // 切换每页多少条数据
    changePageSize(size) {
      this.pagination.size = size;
      this.getUsers();
    },

    // 切换当前页
    changePage(page) {
      this.pagination.page = page;
      this.getUsers();
    },

    // 重置搜索条件
    reset() {
      this.searchModel.type = "";
      this.searchModel.content = "";
      this.pagination.page = 1;
      this.pagination.size = 10;
      this.getUsers();
    }
  }
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
