<template>
  <div>
    <div class="header">
      <div class="action">
        <Input class="action-250" placeholder="请输入产品名称"></Input>
        <Button class="action-btn" type="primary">查询</Button>
        <Button class="action-btn" type="success" @click="addProduct"
          >添加</Button
        >
      </div>
    </div>
    <div class="content">
      <Table :columns="columns" :data="data" border></Table>
      <Page
        class="page"
        :page-size="queryForm.size"
        :total="queryForm.total"
        :current="queryForm.current"
      ></Page>
    </div>
    <Modal
      :styles="{ top: '30px' }"
      title="添加产品"
      v-model="showModal"
      :mask-closable="false"
      @on-cancel="cancelCommit"
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
        <FormItem label="产品类型" prop="typeIds">
          <Tree-Select
            :data="type"
            v-model="productForm.typeIds"
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
            :list="productForm.images"
            :show-upload-list="false"
            view-url="/api/product/viewProductImage/"
            action="/api/product/uploadProductImage"
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
            :list="productForm.homeImages"
            :max-length="1"
            :show-upload-list="false"
            view-url="/api/product/viewProductImage/"
            action="/api/product/uploadProductImage"
            @upload-success="handleHomeSuccess"
          ></Upload-File>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelCommit">取消</Button>
        <Button type="primary" @click="confirmCommit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { array2Tree } from "@/libs/tools";
import TreeSelect from "_c/tree-select";
import UploadFile from "_c/upload-file";
export default {
  components: {
    TreeSelect,
    UploadFile,
  },
  data() {
    return {
      columns: [
        {
          type: "index",
          title: "序号",
          align: "center",
          width: 70,
        },
        {
          title: "产品名称",
          key: "productName",
          align: "center",
          width: 200,
        },
        {
          title: "产品型号",
          key: "productModel",
          align: "center",
          width: 150,
        },
        {
          title: "产品单位",
          key: "productUnit",
          align: "center",
          width: 100,
        },
        {
          title: "产品售价",
          key: "productPrice",
          align: "center",
          width: 100,
        },
        {
          title: "优惠售价",
          key: "productFPrice",
          align: "center",
          width: 100,
        },
        {
          title: "产品描述",
          key: "productDetail",
          align: "center",
          tooltip: true,
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.updateProduct(params.row);
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      data: [],
      type: [],
      productForm: {},
      showModal: false,
      queryForm: {
        current: 1,
        total: 0,
        size: 10,
      },
    };
  },
  created() {
    this.queryProductType();
    this.queryProduct();
  },
  methods: {
    queryProductType() {
      this.$getRequest("/product/queryProductTypeList").then((res) => {
        let map = {};
        res.data.result.forEach((item) => {
          map[item["productTypeId"]] = item;
          item.title = item.typeName;
          item.id = item.productTypeId;
        });
        this.type = array2Tree(res.data.result, map, "typeParent");
      });
    },
    queryProduct() {
      this.$getRequest("/product/queryProductList", this.queryForm).then(
        (res) => {
          this.data = res.data.result.records;
        }
      );
    },
    addProduct() {
      this.showModal = true;
    },
    updateProduct(v) {
      this.productForm = JSON.parse(JSON.stringify(v));

      if (this.productForm.typeId)
        this.productForm.typeIds = this.productForm.typeId.split(",");
      else this.productForm.typeIds = [];

      if (this.productForm.image) {
        this.productForm.images = this.productForm.image.split(",");
      } else this.productForm.images = [];

      if (this.productForm.homeImage) {
        this.productForm.homeImages = this.productForm.homeImage.split(",");
      } else this.productForm.homeImages = [];

      this.showModal = true;
    },
    confirmCommit() {
      console.log(this.productForm);
      if (this.productForm.productId) {
        this.$putRequest("/product/updateProduct", this.productForm).then(
          (res) => {
            if (res.data.result) {
              this.showModal = false;
              this.queryProduct();
              this.$refs["productForm"].resetFields();
              this.productForm.images = [];
              this.productForm.productFirst = 0;
            }
          }
        );
      } else {
        this.$postRequest("/product/addProduct", this.productForm).then(
          (res) => {
            if (res.data.result) {
              this.showModal = false;
              this.queryProduct();
              this.$refs["productForm"].resetFields();
              this.productForm.images = [];
              this.productForm.productFirst = 0;
            }
          }
        );
      }
    },
    cancelCommit() {
      this.showModal = false;
      this.$refs["productForm"].resetFields();
      this.productForm.images = [];
      this.productForm.productFirst = 0;
    },
    isFirst(res) {
      if (!res) {
        this.productForm.homeImages = [];
      }
    },
    handleSuccess(res) {
      if (!this.productForm.images) this.productForm.images = [];
      this.productForm.images.push(res);
    },
    handleHomeSuccess(res) {
      if (!this.productForm.homeImages) this.productForm.homeImages = [];
      this.productForm.homeImages.push(res);
    },
  },
};
</script>

<style lang="less" scoped>
</style>