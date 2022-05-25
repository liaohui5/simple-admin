<template>
  <el-container class="layout-container">
    <el-header class="navbar">
      <Navbar />
    </el-header>
    <el-container class="layout-container">
      <el-aside width="30rem" class="sidebar">
        <Sidebar />
      </el-aside>
      <el-main class="contents-container">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navbar from "@/views/main/navbar.vue";
import Sidebar from "@/views/main/sidebar.vue";
export default {
  components: {
    Navbar,
    Sidebar,
  },
};
</script>

<style lang="less">
.layout-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .navbar {
    line-height: 6rem;
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
    padding: 1.5rem 1.5rem 0px 1.5rem;
  }
}
</style>
