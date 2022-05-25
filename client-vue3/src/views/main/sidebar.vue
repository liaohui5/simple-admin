<template>
  <el-menu :router="true" :default-active="$route.path" class="sidebar-wrapper">
    <el-menu-item index="/">首页</el-menu-item>
    <el-sub-menu v-for="menu in menus" :key="menu.id" :index="`${menu.id}`">
      <template #title>
        <span>{{ menu.desc }}</span>
      </template>
      <el-menu-item
        v-for="item in menu.children"
        :key="item.id"
        :index="item.path"
      >
        {{ item.desc }}
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { useRoute } from "vue-router";

const $store = useAuthStore();
const menus = $store.menus;

const $route = useRoute();
</script>

<style lang="less" scoped>
.sidebar-wrapper {
  //  sdf
}
</style>
