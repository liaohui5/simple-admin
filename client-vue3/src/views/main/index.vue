<template lang="pug">
el-container.layout-container
  el-header.navbar
    navbar
  el-container.layout-container
    el-aside.sidebar(width="30rem")
      sidebar
    el-main.contents-container
      router-view
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
