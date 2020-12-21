<template>
  <el-container class="layout-container">
    <el-header class="navbar">
      <navbar />
    </el-header>
    <el-container class="layout-container">
      <el-aside width="300px" class="sidebar">
        <el-menu :router="true" :default-active="$route.path" :collapse-transition="false">
          <el-menu-item index="welcome">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </template>
          </el-menu-item>
          <el-submenu v-for="item in permissionsTree" :key="item.id" :index="item.desc">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.desc }}</span>
            </template>
            <el-menu-item-group v-for="subMenu in item.children" :key="subMenu.desc" :index="subMenu.desc">
              <el-menu-item :index="subMenu.path">
                <template slot="title">
                  <i :class="subMenu.icon"></i>
                  <span slot="title">{{ subMenu.desc }}</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="contents-container">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navbar from "@/components/Navbar";
import { mapGetters } from "vuex";

export default {
  components: {
    Navbar
  },
  computed: {
    ...mapGetters("login", ["permissionsTree"])
  }
};
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .navbar {
    line-height: 60px;
    border-bottom: 1px solid #eee;
  }
  .sidebar {
    border-right: 1px solid #eee;
    background: #fff;
    color: #555;
    .el-menu {
      border: none;
    }
  }
  .contents-container {
    padding: 15px 15px 0px 15px;
  }
}
</style>
