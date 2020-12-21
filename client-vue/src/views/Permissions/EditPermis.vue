<template>
  <el-dialog title="提示" :visible.sync="show" :close-on-press-escape="false" :close-on-click-modal="false">
    <el-form :rules="formRules" label-position="left" label-width="100px" :model="permission">
      <el-form-item label="权限类型">
        <el-radio-group v-model="permission.type">
          <el-radio :label="0">路由权限</el-radio>
          <el-radio :label="1">API权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="desc" label="权限描述">
        <el-input v-model.trim="permission.desc" max="32" />
      </el-form-item>
      <el-form-item prop="path" label="权限路径">
        <el-input v-model.trim="permission.path" />
      </el-form-item>
      <el-form-item prop="pid" label="父级权限ID">
        <el-input v-model.number="permission.pid" type="number" min="0" />
      </el-form-item>
      <el-form-item prop="method" v-if="permission.type === 1" label="请求方法">
        <el-select v-model="permission.method">
          <el-option v-for="item in httpMethods" :key="item.val" :value="item.val">
            <div class="option-item">
              <span>{{ item.val }}</span>
              <span class="desc">{{ item.desc }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else label="icon">
        <div class="icon-wrapper">
          <el-input v-model.trim="permission.icon" max="32" />
          <a href="https://element.eleme.cn/#/zh-CN/component/icon" target="_blank" class="all-icon-link"
            >查看所有图标</a
          >
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="update(permission)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updatePermission } from "@/api";
export default {
  data() {
    return {
      show: false,
      permission: {},
      httpMethods: [
        { val: "get", desc: "获取列表" },
        { val: "post", desc: "创建数据" },
        { val: "patch", desc: "修改数据" },
        { val: "delete", desc: "删除数据" }
      ],
      formRules: {
        type: [{ trigger: "blur", message: "权限类型不能为空", required: true }],
        desc: [{ trigger: "blur", message: "权限描述不能为空", required: true }],
        pid: [{ trigger: "blur", message: "父级权限不能为空", required: true }],
        path: [{ trigger: "blur", validator: this.checkPath }],
        method: [{ trigger: "blur", validator: this.checkMethod }]
      }
    };
  },
  watch: {
    show(val) {
      if (!val) this.permission = {};
    }
  },
  methods: {
    // 检查path字段是否有误
    checkPath(rule, val, callback) {
      if (this.permission.pid === 0) return callback();
      return val ? callback() : callback(new Error("权限路径不能为空"));
    },

    // 检查method字段是否有误
    checkMethod(rule, val, callback) {
      const { type, pid } = this.permission;
      if (type === 0 || pid === 0) return callback();
      return val ? callback() : callback(new Error("请选择HTTP请求方式"));
    },

    // 更新数据
    async update(data) {
      const res = await updatePermission(data.id, data);
      if (res.success) {
        this.$message.success("修改成功");
        this.show = false;
        this.$emit("refresh");
      }
    },

    // 显示修改信息dialog
    showDialog(row) {
      this.permission = row;
      this.show = true;
    }
  }
};
</script>

<style lang="scss" scope>
.option-item {
  display: flex;
  justify-content: space-between;
  .desc {
    color: #ccc;
  }
}
.icon-wrapper {
  display: flex;
  justify-content: space-between;
  .all-icon-link {
    text-align: right;
    display: inline-block;
    min-width: 150px;
  }
}
</style>
