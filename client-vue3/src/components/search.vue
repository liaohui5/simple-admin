<template lang="pug">
.search-wrapper
  el-form.left-form(:inline="true" :model="searchForm")
    el-form-item.search-item
      el-input(v-model="searchForm.content" placeholder="请输入要搜索的内容")
        template(#prepend)
          el-select.search-type-select(v-model="searchForm.type" placeholder="请选择")
            el-option(v-for="item of searchTypes" :key="item.value" :value="item.value" :label="item.label")
    el-form-item
      el-button(type="success" @click="search") 搜索
      el-button(type="danger" @click="reset") 重置
  .right-btns(v-if="btns.length")
    el-button(v-for="item of btns" :key="item.text" @click="item.handler" :type="item.type") {{item.text}}
</template>

<script setup>
import { reactive } from "@vue/reactivity";
const porps = defineProps({
  searchTypes: {
    // [{label: '显示的文本', value: '实际的值'}]
    type: Array,
    required: true,
  },
  btns: {
    // [{type: 'el-button的type值', text: '按钮文本', handler: 处理点击的函数}]
    type: Array,
    default: () => [],
  },
});

// 搜索表单
const searchForm = reactive({
  type: "",
  content: "",
});

// 定义事件
const emit = defineEmits(['search', 'reset']);

// 重置搜索表单数据
function reset() {
  searchForm.type = "";
  searchForm.content = "";
  emit('reset', searchForm);
}


// 搜索
function search() {
  emit('search', searchForm);
}
</script>

<style lang="less" scoped>
.search-wrapper {
  display: flex;
  justify-content: space-around;
  .left-form {
    flex: 1;
    .search-item {
      width: 40rem;
    }
    .search-type-select {
      width: 10rem;
    }
  }
  .right-btns {
    flex: 1;
    display: flex;
    justify-content: right;
  }
}
</style>
