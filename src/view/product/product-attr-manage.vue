<template>
  <Modal
    ref="productAttrManage"
    title="产品属性管理"
    @on-visible-change="watchVisible"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <Card
      class="product-attr-card"
      v-for="(item, index) in productAttrs"
      :key="index"
      dis-hover
    >
      <div slot="title">
        属性
      </div>
      <div slot="extra">
        <Icon type="md-close" @click="delProductAttr(index)" />
      </div>
      <Form ref="productAttrForm" :label-width="120" label-colon>
        <FormItem label="产品属性名称">
          <Input class="product-attr-name" v-model="item.productAttrName" />
        </FormItem>
        <FormItem label="控件类型">
          <Select class="product-attr-name" v-model="item.widget">
            <Option :value="1">普通选择器</Option>
            <Option :value="2">颜色选择器</Option>
            <Option :value="3">尺寸选择器</Option>
          </Select>
        </FormItem>
        <FormItem label="产品属性值">
          <div v-if="item.widget === 2" class="product-attr-value-wrap">
            <div class="product-attr-color" v-for="(attr, i) in item.productAttrValueList" :key="i">
              <ColorPicker class="product-attr-color-picker" v-model="item.productAttrValueList[i]">
              </ColorPicker>
              <Button
                class="product-attr-color-btn"
                icon="md-close"
                @click="delProductAttrValue(index, i)"
              ></Button>
            </div>
            <Button
              icon="md-add"
              type="dashed"
              @click="addProductAttrValue(index)"
            >
              添加标签
            </Button>
          </div>
          <div v-else class="product-attr-value-wrap">
            <Input
              class="product-attr-input"
              v-for="(attr, i) in item.productAttrValueList"
              :key="i"
              v-model="item.productAttrValueList[i]"
            >
              <div slot="append">
                <Button
                  icon="md-close"
                  @click="delProductAttrValue(index, i)"
                ></Button>
              </div>
            </Input>
            <Button
              icon="md-add"
              type="dashed"
              @click="addProductAttrValue(index)"
            >
              添加标签
            </Button>
          </div>
        </FormItem>
      </Form>
    </Card>
    <Button icon="md-add" type="dashed" long @click="addProductAttr">
      添加属性
    </Button>
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
        this.queryProductAttrList();
      }
    },
    queryProductAttrList() {
      this.$getRequest("/product/productAttr/queryProductAttrList", {
        productId: this.productId
      }).then(res => {
        this.productAttrs = res.data.result;
      });
    },
    cancel() {
      this.$refs["productAttrManage"].close();
    },
    confirm() {
      this.$postRequest(
        "/product/productAttr/addOrDelProductAttr/" + this.productId,
        this.productAttrs
      ).then(res => {
        if (res.data.result) {
          this.$refs["productAttrManage"].close();
          this.queryProductAttrList();
        }
      });
    },
    addProductAttr() {
      this.productAttrs.push({
        productAttrName: "",
        productAttrValueList: []
      });
    },
    delProductAttr(index) {
      this.productAttrs.splice(index, 1);
    },
    addProductAttrValue(index) {
      this.productAttrs[index].productAttrValueList.push("");
    },
    delProductAttrValue(index, i) {
      this.productAttrs[index].productAttrValueList.splice(i, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.product-attr-card {
  margin: 5px 0;
  /deep/ .ivu-card-extra {
    top: 10px;
  }
}
.product-attr-name {
  width: 325px;
}
.product-attr-value-wrap {
  display: flex;
  flex-wrap: wrap;
  .product-attr-input {
    margin-right: 5px;
    margin-bottom: 5px;
    width: 160px;
  }
  .product-attr-color {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .product-attr-color-picker {
    /deep/ .ivu-color-picker-input {
      width: 130px;
      border-radius: 4px 0 0 4px;
    }
  }
  .product-attr-color-btn {
    margin-left: -1px;
    width: 33px;
    background-color: #f8f8f8;
    border: 1px solid #dcdee2;
    border-radius: 0 4px 4px 0;
  }
}
</style>
