<template lang="pug">
.paginate
  el-pagination(
    v-bind="$attrs"
    v-model:currentPage="page"
    v-model:pageSize="pageSize"
    :total="total"
    :page-sizes="pageSizes"
    background
    layout="total, sizes, prev, pager, next, jumper")
</template>
<script setup>
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 50]
  }
});

const page = ref(1);
const pageSize = ref(props.pageSizes[0]);

const emit = defineEmits(['page-change', 'page-size-change']);
watch(page, () => emit('page-change', page.value));
watch(pageSize, () => emit('page-size-change', pageSize.value));
</script>

<style lang="less" scoped>
.paginate {
  padding-top: 3rem;
}
</style>
