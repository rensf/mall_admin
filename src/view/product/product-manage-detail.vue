<template>
  <Modal
    ref="productManageDetail"
    :styles="{ top: '30px' }"
    :mask-closable="false"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <Form
      ref="productForm"
      :model="productForm"
      :label-width="80"
      :label-colon="true"
    >
      <FormItem label="产品名称" prop="productName">
        <Input
          type="text"
          v-model="productForm.productName"
          placeholder="请输入产品名称"
        ></Input>
      </FormItem>
      <FormItem label="产品类型" prop="typeIdList">
        <Tree-Select
          :data="type"
          v-model="productForm.typeIdList"
          placeholder="请选择产品类型"
        ></Tree-Select>
      </FormItem>
      <FormItem label="产品型号" prop="productModel">
        <Input
          type="text"
          v-model="productForm.productModel"
          placeholder="请输入产品型号"
        ></Input>
      </FormItem>
      <FormItem label="产品单位" prop="productUnit">
        <Input
          type="text"
          v-model="productForm.productUnit"
          placeholder="请输入产品单位"
        ></Input>
      </FormItem>
      <FormItem label="产品售价" prop="productPrice">
        <Input
          type="number"
          v-model="productForm.productPrice"
          placeholder="请输入产品售价"
        ></Input>
      </FormItem>
      <FormItem label="产品描述" prop="productDetail">
        <Input
          type="textarea"
          v-model="productForm.productDetail"
          maxlength="300"
          show-word-limit
          :rows="4"
          placeholder="请输入产品描述"
        ></Input>
      </FormItem>
      <FormItem label="产品图片">
        <Upload-File
          type="drag"
          :list="productForm.imageList"
          :show-upload-list="false"
          view-url="/api/product/product/viewProductImage/"
          delete-url="/product/product/deleteProductImage/"
          action="/api/product/product/uploadProductImage"
          @upload-success="handleSuccess"
        ></Upload-File>
      </FormItem>
      <FormItem label="是否首推">
        <Switch
          v-model="productForm.productFirst"
          :true-value="1"
          :false-value="0"
          @on-change="isFirst"
        ></Switch>
      </FormItem>
      <FormItem v-if="productForm.productFirst" label="首页图片">
        <Upload-File
          type="drag"
          :list="productForm.homeImageList"
          :max-length="1"
          :show-upload-list="false"
          view-url="/api/product/product/viewProductImage/"
          delete-url="/api/product/product/deleteProductImage/"
          action="/api/product/product/uploadProductImage"
          @upload-success="handleHomeSuccess"
        ></Upload-File>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="confirm">确认</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "ProductManageAdd",
  props: [],
  data() {
    return {};
  },
  methods: {
    cancel() {

    },
    confirm() {
      this.$refs.productForm.validate((valid) => {
        if (valid) {

        }
      });
    },
  }
};
</script>
