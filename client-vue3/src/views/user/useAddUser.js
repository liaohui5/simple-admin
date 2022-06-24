"use strict";

import { reactive, ref } from "vue";

import { checkUsernameRules, checkPasswordRules, checkEmailRules  } from "@/utils/formCheckRules";

import {createUser} from "@/api";

function useAddUser(refresh) {
  const layerRef = ref(null);
  const formRef = ref(null);

  const addUserModel = reactive({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  // 表单数据验证
  const addUserRules = {
    username: checkUsernameRules,
    password: checkPasswordRules,
    email: checkEmailRules,
    confirm: [
      // 检查两次密码是否相同
      { required: true, message: "确认密码不能为空", trigger: "blur" },
      {
        trigger: "blur",
        validator(rule, value, callback) {
          if (value !== addUserModel.password) {
            callback(new Error("两次密码不一致"));
            return;
          }
          callback();
        },
      },
    ],
  };

  // 点击确定提交表单
  function confirm() {
    formRef.value.validate(async (isPass) => {
      if (!isPass) return;
      await createUser(addUserModel);
      cancel();
      typeof refresh === "function" && refresh();
    });
  }

  // 重置表单数据
  function resetForm() {
    Object.keys(addUserModel).forEach((key) => {
      addUserModel[key] = "";
    });
  }

  // 取消
  function cancel() {
    resetForm();
    layerRef.value.toggle(false);
  }

  return {
    layerRef,
    formRef,
    addUserModel,
    addUserRules,
    confirm,
    cancel,
  };
}

export default useAddUser;
