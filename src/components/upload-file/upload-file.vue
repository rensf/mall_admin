<template>
  <div class="upload">
    <div v-if="showList">
      <div
        class="upload-image"
        :style="{
          width: uploadWidth + 'px',
          height: uploadHeight + 'px',
          lineHeight: uploadHeight + 'px',
        }"
        v-for="(item, index) in list"
        :key="index"
      >
        <img :src="viewUrl + item" />
        <Icon class="upload-image-icon" type="md-close" @click="handleDelete(item)"></Icon>
      </div>
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
    deleteUrl: "",
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
    handleDelete(req) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除该张图片吗?",
        onOk: () => {
          this.$deleteRequest(this.deleteUrl + req).then((res) => {
            if (res.data.result) {
              this.list.splice(this.list.indexOf(req), 1);
            }
          });
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.upload {
  display: flex;

  &-image {
    display: inline-block;
    position: relative;
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
      top: 0;
      left: 46px;
      border-radius: 40%;
      background: #ffddb6;
      opacity: 75%;
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