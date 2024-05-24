<template>
  <div>
    <div class="header">
      <div class="action">
        <Button class="action-btn" type="success" @click="addStock">
          添加
        </Button>
      </div>
    </div>
    <div class="content">
      <Table :columns="columns" :data="data" border></Table>
      <Page class="page"></Page>
    </div>
    <Modal
      :styles="{ top: '30px' }"
      title="添加库存"
      width="1000"
      v-model="showAdd"
      :mask-closable="false"
    >
      <Steps :current="currentStep">
        <Step title="选择产品类型"></Step>
        <Step title="选择产品"></Step>
        <Step title="添加库存"></Step>
      </Steps>
      <div v-if="currentStep === 0">
        <CascaderPanel
          :data="productTypeList"
          @handleChecked="handleChecked"
        ></CascaderPanel>
        <span>您选择的产品类型：{{ checkedTitles }}</span>
      </div>
      <div v-if="currentStep === 1" class="content">
        <Table :columns="productColumns" :data="productList" border></Table>
        <Page
          class="page"
          :page-size="queryProductForm.size"
          :total="queryProductForm.total"
          :current="queryProductForm.current"
          show-sizer
        ></Page>
      </div>
      <div v-if="currentStep === 2" class="content">
        <Table :columns="stockColumns" :data="stockList" border></Table>
      </div>
      <div slot="footer">
        <Button
          v-show="currentStep !== 0"
          type="primary"
          :disabled="prevStepDis"
          @click="prevStep"
        >
          上一步
        </Button>
        <Button
          v-show="currentStep !== 2"
          type="primary"
          :disabled="nextStepDis"
          @click="nextStep"
        >
          下一步
        </Button>
        <Button>取消</Button>
        <Button
          v-show="currentStep === 2"
          type="primary"
          @click="confirmSaveStock"
          >确认</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import { array2Tree } from "@/libs/tools";
import CascaderPanel from "_c/cascader-panel";
export default {
  name: "StockManage",
  components: {
    CascaderPanel
  },
  data() {
    return {
      columns: [
        {
          type: "index",
          title: "序号",
          align: "center",
          width: 70
        },
        {
          title: "库存名称",
          key: "stockName",
          align: "center",
          width: 200
        },
        {
          title: "库存规格",
          key: "stockSpecs",
          align: "center",
          width: 200
        },
        {
          title: "库存单位",
          key: "stockUnit",
          align: "center",
          width: 200
        },
        {
          title: "库存数量",
          key: "stockNums",
          align: "center",
          width: 200
        },
        {
          title: "库存售价",
          key: "stockPrice",
          align: "center",
          width: 200
        },
        {
          title: "折扣售价",
          key: "stockDiscountPrice",
          align: "center",
          width: 200
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth: 300,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {}
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {}
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: [],
      showAdd: false,
      currentStep: 0,
      prevStepDis: true,
      nextStepDis: true,
      productTypeList: [],
      checkedType: {},
      checkedTitles: "",
      checkedProduct: {},
      productColumns: [
        {
          title: "",
          key: "productId",
          align: "center",
          width: 54,
          render: (h, params) => {
            let checked = false;
            if (this.checkedProduct.productId === params.row.productId) {
              checked = true;
            }
            return h("div", [
              h("Radio", {
                props: {
                  value: checked
                },
                on: {
                  "on-change": () => {
                    this.checkedProduct = params.row;
                    this.nextStepDis = false;
                  }
                }
              })
            ]);
          }
        },
        {
          type: "index",
          title: "序号",
          align: "center",
          width: 70
        },
        {
          title: "产品名称",
          key: "productName",
          align: "center",
          minWidth: 200
        },
        {
          title: "产品型号",
          key: "productModel",
          align: "center",
          width: 200
        },
        {
          title: "产品单位",
          key: "productUnit",
          align: "center",
          width: 200
        },
        {
          title: "产品价格",
          key: "productPrice",
          align: "center",
          width: 200
        }
      ],
      productList: [],
      queryProductForm: {
        current: 1,
        total: 0,
        size: 10
      },
      stockColumns: [
        {
          type: "index",
          title: "序号",
          align: "center",
          width: 70
        },
        {
          title: "产品规格",
          key: "stockSpecs",
          align: "center",
          minWidth: 200
        },
        {
          title: "库存名称",
          key: "stockName",
          align: "center",
          width: 200,
          render: (h, params) => {
            this.stockList[params.index].stockName = this.checkedProduct.productName;
            return h("Input", {
              props: {
                value: this.checkedProduct.productName
              },
              on: {
                input: v => {
                  this.stockList[params.index].stockName = v;
                }
              }
            });
          }
        },
        {
          title: "库存单位",
          key: "stockUnit",
          align: "center",
          width: 200,
          render: (h, params) => {
            this.stockList[params.index].stockUnit = this.checkedProduct.productUnit;
            return h("Input", {
              props: {
                value: this.checkedProduct.productUnit
              },
              on: {
                input: v => {
                  this.stockList[params.index].stockUnit = v;
                }
              }
            });
          }
        },
        {
          title: "库存数量",
          key: "stockNums",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.stockNums
              },
              on: {
                input: v => {
                  this.stockList[params.index].stockNums = v;
                }
              }
            });
          }
        },
        {
          title: "库存售价",
          key: "stockPrice",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.stockPrice
              },
              on: {
                input: v => {
                  this.stockList[params.index].stockPrice = v;
                }
              }
            });
          }
        },
        {
          title: "库存折扣售价",
          key: "stockDiscountPrice",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.stockDiscountPrice
              },
              on: {
                input: v => {
                  this.stockList[params.index].stockDiscountPrice = v;
                }
              }
            });
          }
        }
      ],
      stockList: []
    };
  },
  mounted() {
    this.queryStockList();
  },
  watch: {
    currentStep: {
      handler(val) {
        // 步骤1 查询产品类型
        if (val === 0) {
          this.queryProductType();
        }
        // 步骤2 查询选择产品类型下的所有产品
        if (val === 1) {
          this.queryProduct();
        }
        // 步骤3 查询规格
        if (val === 2) {
          this.querySpec();
        }
      },
      immediate: true
    }
  },
  methods: {
    queryStockList() {
      this.$getRequest("/stock/stock/queryStockList").then(res => {
        this.data = res.data.result.records;
      });
    },
    queryProductType() {
      this.$getRequest("/product/productType/queryProductTypeList").then(
        res => {
          let data = res.data.result;
          let map = {};
          data.forEach(item => {
            map[item["productTypeId"]] = item;
            item.title = item.productTypeName;
          });
          this.productTypeList = array2Tree(
            data,
            map,
            "productParentTypeId",
            true
          );
        }
      );
    },
    queryProduct() {
      this.queryProductForm.productTypeId = this.checkedType.productTypeId;
      this.$getRequest(
        "/product/product/queryProductList",
        this.queryProductForm
      ).then(res => {
        this.productList = res.data.result.records;
      });
    },
    querySpec() {
      this.$getRequest("/stock/stock/querySpecList", {
        productId: this.checkedProduct.productId
      }).then(res => {
        this.stockList = res.data.result;
      });
    },

    addStock() {
      this.showAdd = true;
    },
    handleChecked(data, title) {
      this.checkedType = data;
      this.checkedTitles = title.filter(Boolean).join(" ﹥ ");
      this.nextStepDis = false;
    },
    prevStep() {
      this.currentStep--;
    },
    nextStep() {
      if (this.currentStep === 0) {
        this.prevStepDis = false;
        this.nextStepDis = true;
        this.currentStep++;
      } else if (this.currentStep === 1) {
        this.prevStepDis = false;
        this.currentStep++;
      }
    },
    confirmSaveStock() {
      this.$postRequest("/stock/stock/saveStock", this.stockList).then(res => {
        this.showAdd = false;
      });
    }
  }
};
</script>
