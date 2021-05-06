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
      v-for="item in list"
    >
      <img :src="viewUrl + item" />
      <Icon type="md-close" @click="handleDelete"></Icon>
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
    viewUrl: "",
  },
  methods: {
    handleBeforeUpload() {
      if (this.maxLength && this.list) {
        const check = this.list.length < this.maxLength;
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
      this.$emit("upload-success", res.result);
    },
    handleDelete() {
      
    }
  },
};
</script>

<style lang="less" scoped>
.upload {
  display: flex;
  position: relative;

  &-image {
    display: inline-block;
    text-align: center;
    border: 0 dashed transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }

    i {
      position: absolute;
      top: -4px;
      left: 50px;
      border-radius: 50%;
      background: #fff9b6;
      cursor: pointer;
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