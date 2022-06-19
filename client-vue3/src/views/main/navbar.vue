<template lang="pug">
.navbar-wrapper
  .logo Admin-Vue3
  .infos
    .item.user
      .avatar
        img(:src="user.avatar")
      p {{ user.username }}
    .item
      el-button(type="primary" @click="goEditPassword") 修改密码
    .item
      el-button(type="danger" @click="logout") 注销登录
</template>

<script setup>
import { useAuthStore } from "@/store/auth.js";
import { useRouter } from "vue-router";

const $store = useAuthStore();
const $router = useRouter();

const user = $store.authUser;

// 注销登录
const logout = () => {
  $store.logout();
  $router.replace({ name: "Login" });
};

const goEditPassword = () => {
  $router.push({ name: "editPassword" });
};
</script>

<style lang="less" scoped>
.navbar-wrapper {
  width: 100%;
  height: 100%;
  // background: #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #555;
  .logo {
    font-size: 2rem;
  }
  .infos {
    display: flex;
    align-items: center;
    .item {
      height: 100%;
      margin-left: 1.5rem;
    }
    .user {
      display: flex;
      align-items: center;
      font-size: 1.6rem;
      .avatar {
        width: 4rem;
        height: 4rem;
        max-width: 40px;
        max-height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 0.5rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
