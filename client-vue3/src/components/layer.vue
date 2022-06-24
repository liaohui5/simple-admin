<template lang="pug">
el-dialog(v-model="showLayer" :width="width" :close-on-click-modal="false" append-to-body v-bind="$attrs")
  .content
    slot
  template(#footer)
    .dialog-footer
      el-button(@click="cancel" type="danger") 取消
      el-button(@click="confirm" type="success") 确定
</template>

<script setup>
import { ref } from "@vue/reactivity";

// props
defineProps({
  width: {
    type: String,
    default: '50%',
  },
});

const showLayer = ref(false);
function toggle (show) {
  showLayer.value = show;
}

// 定义自定义事件
const emit = defineEmits(['cancel', 'confirm']);

// 点击取消按钮
function cancel() {
  emit('cancel');
}

// 点击确定按钮
function confirm() {
  emit('confirm');
}

// 让外界(父组件能够访问到)
defineExpose({ toggle });
</script>

<style lang="less" scoped>

</style>
