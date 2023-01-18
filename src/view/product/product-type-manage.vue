<template>
  <div>
    <div class="header">
      <div class="action">
        <Button type="success" @click="addType">添加</Button>
      </div>
    </div>
    <div class="content">
      <Card title="产品分类">
        <Tree :data="data" @on-contextmenu="handleContextMenu" expand-node>
          <template slot="contextMenu">
            <DropdownItem @click.native="updateType">编辑</DropdownItem>
            <DropdownItem @click.native="deleteType" style="color: #ed4014">
              删除
            </DropdownItem>
          </template>
        </Tree>
      </Card>
    </div>
    <Modal
      :styles="{ top: '30px' }"
      :title="modalTitle"
      v-model="showModal"
      :mask-closable="false"
    >
      <Form
        ref="typeForm"
        :model="typeForm"
        :label-width="80"
        :label-colon="true"
      >
        <FormItem label="分类名称" prop="productTypeName">
          <Input
            v-model="typeForm.productTypeName"
            placeholder="请输入分类名称"
          ></Input>
        </FormItem>
        <FormItem label="分类描述" prop="productTypeDetail">
          <Input
            type="textarea"
            v-model="typeForm.productTypeDetail"
            placeholder="请输入分类描述"
          ></Input>
        </FormItem>
        <FormItem label="分类等级" prop="productTypeLevel">
          <Select
            v-model="typeForm.productTypeLevel"
            placeholder="请选择分类等级"
            clearable
          >
            <Option :value="1">一级分类</Option>
            <Option :value="2">二级分类</Option>
            <Option :value="3">三级分类</Option>
          </Select>
        </FormItem>
        <FormItem
          v-if="typeForm.productTypeLevel === 2"
          label="上级分类"
          prop="productParentTypeId"
        >
          <Select
            v-model="typeForm.productParentTypeId"
            placeholder="请选择上级分类"
            clearable
          >
            <template v-for="(item, index) in type">
              <Option
                v-if="item.productTypeLevel === 1"
                :key="index"
                :value="item.productTypeId"
              >
                {{ item.productTypeName }}
              </Option>
            </template>
          </Select>
        </FormItem>
        <FormItem
          v-if="typeForm.productTypeLevel === 3"
          label="上级分类"
          prop="productParentTypeId"
        >
          <Select
            v-model="typeForm.productParentTypeId"
            placeholder="请选择上级分类"
            clearable
          >
            <template v-for="(item, index) in type">
              <Option
                 v-if="item.productTypeLevel === 2"
                :key="index"
                :value="item.productTypeId"
              >
                {{ item.productTypeName }}
              </Option>
            </template>
          </Select>
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
export default {
  data() {
    return {
      type: [],
      data: [],
      typeForm: {},
      modalTitle: "",
      showModal: false,
      contextData: null,
    };
  },
  mounted() {
    this.queryType();
  },
  methods: {
    queryType() {
      this.$getRequest("/product/product/queryProductTypeList").then((res) => {
        this.type = res.data.result;
        let map = {};
        this.type.forEach((item) => {
          map[item["productTypeId"]] = item;
          item.title = item.productTypeName;
        });
        this.data = array2Tree(this.type, map, "productParentTypeId", true);
      });
    },
    addType() {
      this.modalTitle = "添加产品类型";
      this.showModal = true;
    },
    confirmCommit() {
      if (this.typeForm.productTypeId) {
        // 一级类型，将父id置空
        if (this.typeForm.productTypeLevel === "1") {
          this.typeForm.productParentTypeId = "";
        }
        this.$putRequest("/product/product/updateProductType", this.typeForm).then(
          (res) => {
            if (res.data.result) {
              this.queryType();
              this.showModal = false;
              this.modalTitle = "";
              this.$refs["typeForm"].resetFields();
            }
          }
        );
      } else {
        this.$postRequest("/product/product/addProductType", this.typeForm).then(
          (res) => {
            if (res.data.result) {
              this.queryType();
              this.showModal = false;
              this.modalTitle = "";
              this.$refs["typeForm"].resetFields();
            }
          }
        );
      }
    },
    cancelCommit() {
      this.showModal = false;
      this.modalTitle = "";
      this.$refs["typeForm"].resetFields();
    },
    handleContextMenu(data) {
      this.contextData = data;
      console.log(data)
    },
    updateType() {
      this.modalTitle = "更新产品类型";
      this.showModal = true;
      this.typeForm = this.contextData;
    },
    deleteType() {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除该记录吗?",
        onOk: () => {
          this.$deleteRequest(
            "/product/product/deleteProductType",
            this.contextData
          ).then((res) => {
            if (res.data.result) {
              this.queryType();
            }
          });
        },
      });
    },
  },
};
</script>

<style>
</style>