<template>
  <el-dialog
    title="裁剪图片"
    width="90%"
    :visible.sync="show"
    :append-to-body="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div id="crop-container">
      <div class="crop-box">
        <vue-cropper
          ref="cropper"
          mode="cover"
          :img="cropOptions.img"
          :output-size="cropOptions.outputSize"
          :output-type="cropOptions.outputType"
          :full="cropOptions.full"
          :high="cropOptions.high"
          :fixed="cropOptions.fixed"
          :can-move="cropOptions.canMove"
          :can-move-box="cropOptions.canMoveBox"
          :fixed-box="cropOptions.fixedBox"
          :original="cropOptions.original"
          :center-box="cropOptions.centerBox"
          :auto-crop="true"
          :fixed-number="[1, 1]"
          @real-time="realTimePreview"
        />
      </div>
      <div class="preview-box" :style="corpPreviews.div">
        <img :src="corpPreviews.url" :style="corpPreviews.img" />
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="cropImage(false)">取消</el-button>
      <el-button type="primary" @click="cropImage(true)">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  created() {
    // 初始化不需要响应式的状态
    this._originFile = null; // 原文件
    this._cropedFile = null; // 裁剪后的文件
    this._confirm = false; // 是否确定裁剪
    this.cropOptions = { ...this.cropOptions, ...this.options };
  },
  data: () => ({
    show: false,
    corpPreviews: { div: "", url: "", img: "" },
    cropOptions: {
      img: "", // 要裁剪的图片地址
      outputType: "", // 图片裁剪后类型[jpeg|png]
      outputSize: 1, // 图片裁剪后质量
      size: 1, // 图片裁剪质量 0 - 1
      canMove: true, // 是否能移动图片
      canMoveBox: true, // 是否能移动裁剪框
      fixed: true, // 固定缩放比例
      fixedBox: false, // 是否固定裁剪框大小
      original: true, // 裁剪后图片按照原始比例渲染
      fixedNumber: [1, 1], // 缩放比例
      autoCropWidth: 210, // 裁剪框的宽度
      autoCropHeight: 295, // 裁剪框的高度
      centerBox: true, // 裁剪框是否被限制在图片里面
      full: true, // 是否输出原图比例的截图
      high: false, // 	是否按照设备的dpr 输出等比例图片
      minWidth: 100
    }
  }),
  watch: {
    show(val) {
      if (!val) {
        return this._confirm ? this.$emit("finish", this._cropedFile) : this.$emit("cancel");
      }
    }
  },
  methods: {
    // 设置需要裁剪的图片文件
    async setCropImage(file) {
      this._originFile = file;
      const base64 = await this.file2base64(file);
      this.toggleCropLayer(true, base64);
    },

    // 裁剪图片: 获得裁剪后的图片 blob 对象
    cropImage(confirm) {
      if (confirm) {
        const { minWidth } = this.cropOptions;
        if (this.corpPreviews.w < minWidth) {
          this.$message.error(`最小宽度不能小于:${minWidth}`);
          return;
        }
      }

      // 裁剪图片
      this.$refs.cropper.getCropBlob(blob => {
        this.toggleCropLayer(false);
        this._cropedFile = this.blob2file(blob, this._originFile.name);
        this._confirm = confirm;
      });
    },

    // 切换裁剪图片的 dialog 隐藏和显示
    toggleCropLayer(show, file = "") {
      this.cropOptions.img = file;
      this.show = show;
    },

    // 预览图片
    realTimePreview(e) {
      this.corpPreviews = e;
    },

    // 将 File 对象转 base64 字符串
    file2base64(file) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = e => resolve(e.target.result);
      });
    },

    // 转换Blob对象
    blob2file(blob, filename = "") {
      const str = Math.random()
        .toString(36)
        .substr(2);
      filename = filename || str;
      return new window.File([blob], filename, { type: blob.type });
    }
  }
};
</script>

<style lang="scss">
#crop-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .crop-box {
    width: 800px;
    height: 500px;
    .scale-btns {
      padding: 20px 0;
      .btn-img-scale {
        width: 100px;
        height: 30px;
      }
    }
  }
  .preview-box {
    border: 1px solid red;
    overflow: hidden;
  }
}
</style>
