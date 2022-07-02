"use strict";

import { reactive, ref } from "vue";
import { updateUserInfo } from "../../api";

import { checkUsernameRules, checkEmailRules } from "@/utils/formCheckRules";

export default function useUpdateUser(refresh) {
  const updateUserForm = ref(null);
  const updateUserLayer = ref(null);

  // 表单验证规则
  const updateUserModel = reactive({
    id: "",
    email: "",
    username: "",
    password: "",
    avatar: "",
  });

  // 表单验证规则
  const updateUserRules = {
    username: checkUsernameRules,
    email: checkEmailRules,
  };

  // 重置表单
  function updateFormReset(raw) {
    Object.keys(updateUserModel).forEach((key) => {
      if (raw) {
        updateUserModel[key] = raw[key];
      } else {
        updateUserModel[key] = "";
      }
    });
  }

  // 取消
  async function updateUserCancel() {
    updateUserLayer.value.toggle(false);
  }

  // 修改其他信息
  async function updateUserConfirm() {
    await updateUserInfo(updateUserModel.id, updateUserModel);
    await refresh(true);
    updateFormReset();
    updateUserLayer.value.toggle(false);
  }

  // 解锁/锁定
  async function toggleStatus(user) {
    const status = user.status === 1 ? 0 : 1;
    await updateUserInfo(user.id, { status });
    await refresh(true);
  }

  return {
    updateFormReset,
    updateUserLayer,
    updateUserForm,
    updateUserConfirm,
    updateUserCancel,
    updateUserModel,
    updateUserRules,
    toggleStatus,
  };
}
