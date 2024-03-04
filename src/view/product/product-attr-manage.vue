<template>
  <Modal
    ref="productAttrManage"
    title="产品属性管理"
    @on-visible-change="watchVisible"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <Card class="product-attr-card" v-for="(item, index) in productAttrs" :key="index" dis-hover>
      <div slot="title">
        属性
      </div>
      <div slot="extra">
        <Icon type="md-close" @click="delProductAttr(index)" />
      </div>
      <Form ref="productAttrForm" :label-width="120" label-colon>
        <FormItem label="产品属性名称">
          <Input v-model="item.productAttrName" />
        </FormItem>
        <FormItem label="产品属性值">
          <Tag
            v-for="attr in item.productAttrValues"
            :key="attr"
            :name="attr"
            size="medium"
            closable
          >
            {{ attr }}
          </Tag>
          <Button icon="md-add" type="dashed" @click="addProductAttrValue">
            添加标签
          </Button>
        </FormItem>
      </Form>
    </Card>
    <Button icon="md-add" type="dashed" long @click="addProductAttr">添加属性</Button>
    <div slot="footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="confirm">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: "ProductAttrManage",
  props: ["productId"],
  data() {
    return {
      productAttrs: []
    };
  },
  methods: {
    watchVisible(visible) {
      if (visible) {
        this.queryProductAttrs();
      }
    },
    queryProductAttrs() {
      this.$getRequest("/product/productAttr/queryProductAttrs", {
        productId: this.productId
      }).then(res => {
        this.productAttrs = res.data.result;
      });
    },
    cancel() {
      this.$refs["productAttrManage"].close();
    },
    confirm() {
      console.log(this.productAttrs);
      this.$postRequest("/product/productAttr/addProductAttr", this.productAttrs).then(
        res => {
          this.$refs["productAttrManage"].close();
          this.$Message.success("添加成功");
          this.queryProductAttrs();
        }
      );
    },
    addProductAttr() {
      this.productAttrs.push({
        productId: this.productId,
        productAttrName: "",
        productAttrValues: []
      });
    },
    delProductAttr(index) {
      this.productAttrs.splice(index, 1);
    },
    addProductAttrValue() {}
  }
};
</script>

<style lang="less" scoped>
.product-attr-card {
  margin: 5px 0;
}
/deep/ .ivu-card-extra {
  top: 10px;
}
</style>
