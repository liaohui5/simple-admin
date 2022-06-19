<template lang="pug">
<!-- TODO: 优化图标显示 -->
el-menu(:router="true" :default-active="$route.path")
  el-menu-item(index="/") 首页
  el-sub-menu(v-for="menu in menus" :key="menu.id" :index="`${menu.id}`")
    template(#title)
      span {{ menu.desc }}
    el-menu-item(v-for="item in menu.children" :key="item.id" :index="item.path")
      span | {{ item.desc }}
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { useRoute } from "vue-router";

const $store = useAuthStore();
const menus = $store.menus;
const $route = useRoute();
</script>
