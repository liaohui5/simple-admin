<template>
  <div class="breadcrumb-contaienr">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item of props.paths" :key="item">{{
        item
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
const props = defineProps({
  paths: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="less" scoped>
.breadcrumb-contaienr {
  padding: 1rem 0 3rem 0;
}
</style>
