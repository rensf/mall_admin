<template>
  <div>
    <div class="header">
      <div class="action">
        <Button type="success" @click="addType">添加</Button>
      </div>
    </div>
    <div class="content">
      <Card title="产品分类">
        <Tree :data="data" expand-node></Tree>
      </Card>
    </div>
    <Modal title="添加产品分类" v-model="showModal">
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
      showModal: false,
    };
  },
  created() {
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
        this.data = array2Tree(this.type, map, "typeParent");
      });
    },
    addType() {
      this.showModal = true;
    },
    confirmCommit() {
      if (this.typeForm.product_type_id) {
      } else {
        this.$postRequest("/product/addProductType", this.typeForm).then(
          (res) => {
            if (res.data.result) {
              this.queryType();
              this.showModal = false;
              this.$refs["typeForm"].resetFields();
            }
          }
        );
      }
    },
    cancelCommit() {
      this.showModal = false;
      this.$refs["typeForm"].resetFields();
    },
  },
};
</script>

<style>
</style>