<template>
  <div>
    <el-upload class="avatar-uploader" v-bind="$attrs" :before-upload="beforeUpload">
      <slot></slot>
    </el-upload>
    <el-dialog
      title="提示"
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
            :output-type="cropOptions.outputType"
            :output-size="cropOptions.outputSize"
            :fixed="cropOptions.fixed"
            :can-move="cropOptions.canMove"
            :can-move-box="cropOptions.canMoveBox"
            :center-box="cropOptions.centerBox"
            :auto-crop="true"
            :full="cropOptions.full"
            :high="cropOptions.high"
            :fixed-box="cropOptions.fixedBox"
            :original="cropOptions.original"
            :fixed-number="cropOptions.fixedNumber"
            :info-true="cropOptions.infoTrue"
            :info="cropOptions.info"
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
  </div>
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
    this.initState();
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
      original: false, // 裁剪后图片按照原始比例渲染
      fixedNumber: [1, 1], // 缩放比例
      centerBox: true, // 裁剪框是否被限制在图片里面
      full: false, // 是否输出原图比例的截图
      high: true, // 是否按照设备的dpr 输出等比例图片
      infoTrue: false,
      info: false,
      minWidth: 100 // 最小图片宽度
    }
  }),

  methods: {
    // 初始化状态(不需要在响应式的状态)
    initState() {
      this._originFile = null; // 原图片文件 File 对象
      this._cropedFile = null; // 裁剪成功后的 File 对象
      this._confirm = false; // 是否确定裁剪
    },

    // 切换裁剪图片的 dialog 隐藏和显示
    toggleCroperLayer(show, file = "") {
      this.cropOptions.img = file;
      this.show = show;
    },

    // 预览图片
    realTimePreview(e) {
      this.corpPreviews = e;
    },

    // 上传之前: 获取file对象进行参数验证
    beforeUpload(file) {
      this._originFile = file;
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const base64 = await this.file2base64(file);
        this.toggleCroperLayer(true, base64);
        this.$watch("show", val => {
          if (!val) {
            const { beforeUploadHook, directlyUpload = true } = this.options;
            if (directlyUpload) return resolve(this._cropedFile);
            if (typeof beforeUploadHook === "function") {
              return beforeUploadHook(this._cropedFile, resolve, reject);
            } else {
              return reject(file);
            }
          }
        });
      });
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
      this.$refs.cropper.getCropBlob(blob => {
        this.toggleCroperLayer(false);
        const filename = this._originFile.name;
        this._cropedFile = new window.File([blob], filename, { type: blob.type });
        this._confirm = confirm;
      });
    },

    // 转换文件对象
    file2base64(file) {
      if (!(file instanceof window.File)) {
        throw new TypeError("The paramter must be instance of File");
      }
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = e => resolve(e.target.result);
      });
    }
  }
};
</script>

<style lang="scss">
/* 图片裁剪插件 */
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
