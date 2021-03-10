<template>
  <div class="upload">
    <div
      v-if="showList"
      class="upload-image"
      :style="{
        width: uploadWidth + 'px',
        height: uploadHeight + 'px',
        lineHeight: uploadHeight + 'px',
      }"
      v-for="item in imgList"
    >
      <img :src="item.url" />
    </div>
    <Input v-if="!showList" class="upload-input" v-model="value"></Input>
    <Upload
      class="upload-file"
      :style="{ width: uploadWidth + 'px' }"
      v-bind="$attrs"
      v-on="$listeners"
      :before-upload="handleBeforeUpload"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :on-success="handleSuccess"
    >
      <Icon
        v-if="showList"
        :style="{
          height: uploadHeight + 'px',
          lineHeight: uploadHeight + 'px',
        }"
        :type="icon"
      ></Icon>
      <Button v-else :icon="icon">{{ text }}</Button>
    </Upload>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    showList: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
    },
    value: "",
    maxLength: {
      type: Number,
    },
    uploadWidth: {
      type: String,
      default: "60",
    },
    uploadHeight: {
      type: String,
      default: "60",
    },
    icon: {
      type: String,
      default: "md-add",
    },
    text: "",
  },
  data() {
    return {
      imgList: this.list ? this.list : [],
    };
  },
  methods: {
    handleBeforeUpload() {
      if (this.maxLength) {
        const check = this.imgList.length < this.maxLength;
        if (!check) {
          this.$Notice.warning({
            title: "文件数量超过限制！",
          });
        }
        return check;
      }
    },
    handleFormatError() {
      this.$Notice.warning({
        title: "文件格式错误！",
      });
    },
    handleMaxSize() {
      this.$Notice.warning({
        title: "文件大小超过限制！",
      });
    },
    handleSuccess(res) {
      this.imgList.push({
        url: "/api/product/viewProductImage/" + res.result,
      });
      this.$emit("upload-success", res.result)
    },
  },
};
</script>

<style lang="less" scoped>
.upload {
  display: flex;

  &-image {
    display: inline-block;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &-file {
    display: inline-block;
  }

  &-input {
    display: none;
  }
}
</style>