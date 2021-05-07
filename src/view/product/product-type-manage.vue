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
        <FormItem label="分类名称" prop="typeName">
          <Input
            v-model="typeForm.typeName"
            placeholder="请输入分类名称"
          ></Input>
        </FormItem>
        <FormItem label="分类描述" prop="typeDetail">
          <Input
            type="textarea"
            v-model="typeForm.typeDetail"
            placeholder="请输入分类描述"
          ></Input>
        </FormItem>
        <FormItem label="分类等级" prop="typeLevel">
          <Select
            v-model="typeForm.typeLevel"
            placeholder="请选择分类等级"
            clearable
          >
            <Option value="1">一级分类</Option>
            <Option value="2">二级分类</Option>
            <Option value="3">三级分类</Option>
          </Select>
        </FormItem>
        <FormItem
          v-if="typeForm.typeLevel === '2'"
          label="上级分类"
          prop="typeParent"
        >
          <Select
            v-model="typeForm.typeParent"
            placeholder="请选择上级分类"
            clearable
          >
            <Option
              v-for="(item, index) in type"
              v-if="item.typeLevel === '1'"
              :key="index"
              :value="item.productTypeId"
            >
              {{ item.typeName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          v-if="typeForm.typeLevel === '3'"
          label="上级分类"
          prop="typeParent"
        >
          <Select
            v-model="typeForm.typeParent"
            placeholder="请选择上级分类"
            clearable
          >
            <Option
              v-for="(item, index) in type"
              v-if="item.typeLevel === '2'"
              :key="index"
              :value="item.productTypeId"
            >
              {{ item.typeName }}
            </Option>
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
      this.$getRequest("/product/queryProductTypeList").then((res) => {
        this.type = res.data.result;
        let map = {};
        this.type.forEach((item) => {
          map[item["productTypeId"]] = item;
          item.title = item.typeName;
        });
        this.data = array2Tree(this.type, map, "typeParent", true);
      });
    },
    addType() {
      this.modalTitle = "添加产品类型";
      this.showModal = true;
    },
    confirmCommit() {
      if (this.typeForm.productTypeId) {
        // 一级类型，将父id置空
        if (this.typeForm.typeLevel === "1") {
          this.typeForm.typeParent = "";
        }
        this.$putRequest("/product/updateProductType", this.typeForm).then(
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
        this.$postRequest("/product/addProductType", this.typeForm).then(
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
            "/product/deleteProductType",
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