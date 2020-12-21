<template>
  <div>
    <!-- 顶部导航 -->
    <el-breadcrumb class="top-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 中间主体内容 -->
    <el-card class="box-card">
      <!-- 顶部条件筛选 -->
      <div class="top-search-wrapper">
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="searchModel.type" placeholder="权限类型">
              <el-option :value="0" label="路由权限" />
              <el-option :value="1" label="API权限" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchModel.desc" placeholder="权限描述" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="showAddPermisDialog">添加权限</el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-table :data="permissions.rows" border>
        <el-table-column align="center" width="100px" label="ID" prop="id" />
        <el-table-column label="权限类型">
          <template scope="scope">
            <span>{{ scope.row.type === 0 ? "路由权限" : "API权限" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限描述" prop="desc" />
        <el-table-column label="权限路径" prop="path" />
        <el-table-column label="父级权限ID" prop="pid" width="100px" />
        <el-table-column label="权限状态" width="100px">
          <template scope="scope">
            <el-tag v-if="scope.row.status === 0" type="success" size="small">正常</el-tag>
            <el-tag v-else type="danger" size="small">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button v-if="scope.row.status === 0" size="mini" type="warning" @click="updateRowStatus(scope.row)">
              锁定
            </el-button>
            <el-button v-else size="mini" type="success" @click="updateRowStatus(scope.row)">
              解锁
            </el-button>
            <el-button size="mini" type="primary" @click="showEditDialog(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          :page-size="pagination.size"
          :page-sizes="[10, 20, 30]"
          :total="permissions.count"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加权限 -->
    <add-permis ref="add-permis" @refresh="getDatas" />

    <!-- 修改权限信息 -->
    <edit-permis ref="edit-permis" @refresh="getDatas" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deletePermission } from "../api";
import AddPermis from "./Permissions/AddPermis.vue";
import EditPermis from "./Permissions/EditPermis.vue";
export default {
  components: { AddPermis, EditPermis },
  data: () => ({
    searchModel: {
      type: "", // 权限类型(0: 路由权限 1:API权限 2:所有)
      desc: ""
    },
    pagination: {
      page: 1,
      size: 10
    }
  }),
  computed: {
    ...mapState("permissions", ["permissions"])
  },
  created() {
    this.getDatas();
  },
  methods: {
    // 添加权限信息
    showAddPermisDialog() {
      this.$refs["add-permis"].showDialog();
    },

    // 修改权限状态
    updateRowStatus({ id, status }) {
      status = status === 0 ? 1 : 0;
      const { update } = this.$refs["edit-permis"];

      // 解锁
      if (status === 0) return update({ status, id });

      // 锁定: 先确认
      this.$confirm("确定要锁定吗?锁定该权限后,所有人无法使用该权限", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => update({ status, id }))
        .catch(() => {});
    },

    // 暂时修改权限信息的dialog
    showEditDialog(row) {
      this.$refs["edit-permis"].showDialog(row);
    },

    // 删除权限
    deleteRow(row) {
      this.$confirm("确定要删除该权限吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await deletePermission(row.id);
          if (res.success) {
            this.$message.success("删除成功");
            this.getDatas();
          }
        })
        .catch(() => {});
    },

    // 获取用户权限
    getDatas() {
      const query = { ...this.pagination };
      const { type, desc } = this.searchModel;
      if (type !== "") query.type = type;
      if (desc !== "") query.desc = desc;
      this.$store.dispatch("permissions/getPermissions", query);
    },

    // 切换每页多少条数据
    changePageSize(size) {
      this.pagination.size = size;
      this.getDatas();
    },

    // 切换当前页
    changePage(page) {
      this.pagination.page = page;
      this.getDatas();
    },

    // 搜索权限(两个条件只要一个为真就可以搜索)
    async search() {
      const { type, desc } = this.searchModel;
      if (type === "" && desc.trim() === "") {
        this.$message.warning("请选择权限类型或输入权限描述");
        return;
      }
      this.changePage(1);
    }
  }
};
</script>
