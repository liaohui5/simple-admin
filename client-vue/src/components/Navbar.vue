<template>
  <div id="navbar">
    <div class="logo-wrapper">Admin</div>
    <div class="userinfo-wrapper">
      <div class="avatar">
        <img :src="user.avatar" />
      </div>
      <span class="username">{{ user.username }}</span>
      <!-- TODO: 修改密码 -->
      <el-button type="primary" size="small" @click="logout">修改密码</el-button>
      <el-button type="danger" size="small" @click="logout">注销登录</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "navbar",
  computed: {
    ...mapGetters("login", ["user"])
  },
  methods: {
    logout() {
      this.$store.commit("login/logout");
      this.$router.replace({ name: "login" });
    }
  }
};
</script>

<style lang="scss" scoped>
#navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo-wrapper {
    width: 230px; // 侧边栏宽度 250 - 20(两边的padding)
    font-size: 26px;
    color: #888;
    text-align: center;
  }
  .userinfo-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .avatar {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #eee;
      img {
        width: 100%;
      }
    }
    .username {
      margin: 0 20px 0 20px;
      color: #555;
    }
  }
}
</style>
