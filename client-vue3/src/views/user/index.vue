<template lang="pug">
breadcrumb(:paths="['用户管理', '用户列表']")
.main-content
  search(:search-types="searchTypes", :btns="searchBtns" @search="onSearch" @reset="onReset")
  el-table(:data="datas.rows" border)
    el-table-column(prop="id" label="UID" width="100px")
    el-table-column(label="用户头像" width="100px")
      template(#default="scope")
        .avatar(style="width: 50px; height: 50px; border-radius: 25px; overflow: hidden;")
          img(:src="scope.row.avatar" style="width:100%;")
    el-table-column(prop="username" label="用户名" width="100px")
    el-table-column(prop="email" label="邮箱地址" width="200px")
    el-table-column(prop="roles" label="用户角色")
      template(#default="scope")
        el-tag(v-for="item in scope.row.roles" :key="item.id" type="success" size="small")
          span {{item.role_name}}
    el-table-column(prop="created_at" label="创建时间")
    el-table-column(label="操作")
      template(#default="scope")
        el-button(type="primary" size="small" @click="showUpdateLayer(scope.row)") 修改
        el-button(type="warning" size="small") 分配角色
        el-button(v-if="scope.row.status === 0" type="danger" size="small" @click="toggleStatus(scope.row)") 锁定
        el-button(v-else type="success" size="small" @click="toggleStatus(scope.row)") 解锁
  paginate(:total="datas.count" @page-change="onPageChange" @page-size-change="onPageSizeChange")

//- 添加用户
layer(ref="addUserLayer" title="创建用户信息" @cancel="addUserCancel" @confirm="addUserConfirm")
  el-form(:rules="addUserRules" :model="addUserModel" ref="addUserForm" label-position="left" label-width="100px")
    el-form-item(prop="username" label="用户名")
      el-input(v-model="addUserModel.username" max="16")
    el-form-item(prop="email" label="邮箱")
      el-input(v-model="addUserModel.email")
    el-form-item(prop="password" label="密码")
      el-input(v-model="addUserModel.password" type="password" max="16")
    el-form-item(prop="confirm" label="确认密码")
      el-input(v-model="addUserModel.confirm" type="password" max="16")
    //- 头像

//- 修改用户信息
layer(ref="updateUserLayer" title="修改用户信息" @cancel="updateUserCancel" @confirm="updateUserConfirm")
  el-form(:rules="updateUserRules" :model="updateUserModel" ref="updateUserForm" label-position="left" label-width="100px")
    el-form-item(prop="username" label="用户名")
      el-input(v-model="updateUserModel.username" max="16")
    el-form-item(prop="email" label="邮箱")
      el-input(v-model="updateUserModel.email")
    //-el-form-item(prop="password" label="密码")
      el-input(v-model="updateUserModel.password" type="password" max="16")
    //- 头像
</template>

<script setup>
import { reactive, toRaw } from "@vue/reactivity";
import { onBeforeMount } from "@vue/runtime-core";
import { getUsers } from "@/api";
import { memoize } from "@/utils/tools";
import usePaginteGetData from "@/hooks/usePaginteGetData";
import useAddUser from "./useAddUser";
import useUpdateUser from "./useUpdateUser";

// 添加用户信息: 表单验证规则
const { addUserLayer, addUserForm, addUserCancel, addUserConfirm, addUserModel, addUserRules } = useAddUser(getUserData);

// 修改用户信息
const { toggleStatus, updateUserLayer, updateFormReset, updateUserForm, updateUserCancel, updateUserConfirm, updateUserModel, updateUserRules } = useUpdateUser(getUserData);
function showUpdateLayer(raw) {
  updateUserLayer.value.toggle(true);
  updateFormReset(raw);
}

// 列表展示: 当切换当前页/每页多少条被调用时, 自动调用getUserData
const { params, onPageChange, onPageSizeChange, onSearch, onReset } = usePaginteGetData(getUserData);
const datas = reactive({
  count: 0,
  rows: [],
});

// 列表展示: 获取列表数据
const getUsersCache = memoize(getUsers);
async function getUserData(ignoreCache = false) {
  const query = toRaw(params);
  if (!query.content && !query.type) {
    delete query.type;
    delete query.content;
  }
  const reqUsers = ignoreCache ? getUsers : getUsersCache;
  const res = await reqUsers(query);
  datas.count = res.count;
  datas.rows = res.rows;
}

// 自动获取数据
onBeforeMount(async () => {
  await getUserData();
});

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
      addUserLayer.value.toggle(true);
    },
  },
];
</script>
