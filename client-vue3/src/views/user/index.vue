<template lang="pug">
breadcrumb(:paths="['用户管理', '用户列表']")
.main-content
  search(:search-types="searchTypes", :btns="searchBtns" @search="onSearch" @reset="onReset")
  el-table(:data="datas.rows" border)
    el-table-column(prop="id" label="UID" width="100px")
    el-table-column(label="用户头像" width="100px")
      template(#default="scope")
        img.user-avatar(:src="scope.row.avatar")
    el-table-column(prop="username" label="用户名" width="100px")
    el-table-column(prop="email" label="邮箱地址" width="200px")
    el-table-column(prop="roles" label="用户角色")
      template(#default="scope")
        el-tag(v-for="item in scope.row.roles" :key="item.id" type="success" size="small")
          span {{item.role_name}}
    el-table-column(prop="created_at" label="创建时间")
    el-table-column(label="操作")
      template(#default="scope")
        el-button(type="primary" size="small") 修改
        el-button(type="warning" size="small") 分配角色
        el-button(type="danger" size="small") 锁定
        el-button(type="success" size="small") 解锁
  paginate(:total="datas.count" @page-change="onPageChange" @page-size-change="onPageSizeChange")
</template>

<script setup>
import { reactive, toRaw } from "@vue/reactivity";
import { onBeforeMount } from "@vue/runtime-core";
import { getUsers } from "@/api";
import usePaginteGetData from "@/hooks/usePaginteGetData";

// 搜索下拉框选项
const searchTypes = [
  {
    label: "用户ID",
    value: 1,
  },
  {
    label: "用户名",
    value: 2,
  },
  {
    label: "用户邮箱",
    value: 3,
  },
];

// 搜索栏右边按钮
const searchBtns = [
  {
    type: "success",
    text: "新增用户",
    handler: () => {
      console.info("show new user layer");
    },
  },
];

// 当pageChange/pageSize被调用时, 自动调用getUserData
const { params, onPageChange, onPageSizeChange, onSearch, onReset } = usePaginteGetData(getUserData);
const datas = reactive({
  count: 0,
  rows: [],
});

// 获取数据
async function getUserData() {
  const query = toRaw(params);
  if (!query.content && !query.type) {
    delete query.type;
    delete query.content;
  }
  const res = await getUsers(query);
  datas.count = res.count;
  datas.rows = res.rows;
}

onBeforeMount(async () => {
  await getUserData();
});
</script>
