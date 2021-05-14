<template>
  <div>
    <div class="header">
      <div class="action">
        <Input class="action-250" placeholder="请输入模块名称"></Input>
        <Button class="action-btn" type="primary">查询</Button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "系统名称",
          key: "application",
          align: "center",
          width: 200,
        },
        {
          title: "系统环境",
          key: "profile",
          align: "center",
          width: 200,
        },
        {
          title: "读取分支",
          key: "label",
          align: "center",
          width: 200,
        },
        {
          title: "键",
          key: "key",
          align: "center",
          width: 200,
          render: (h, params) => {
            if (params.index === this.editIndex) {
              return h("Input", {
                props: {
                  value: params.row.key,
                },
                on: {
                  input: (v) => {
                    this.configForm.key = v;
                  },
                },
              });
            } else {
              return h("span", params.row.key);
            }
          },
        },
        {
          title: "值",
          key: "value",
          align: "center",
          width: 200,
          render: (h, params) => {
            if (params.index === this.editIndex) {
              return h("Input", {
                props: {
                  value: params.row.value,
                },
                on: {
                  input: (v) => {
                    this.configForm.value = v;
                  },
                },
              });
            } else {
              return h("span", params.row.value);
            }
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          minWidth: 200,
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
                      if (this.editIndex == params.index) {
                        this.saveUpdate(params.row);
                      } else {
                        this.editIndex = params.index;
                      }
                    },
                  },
                },
                this.editIndex == params.index ? "保存" : "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      if (this.editIndex == params.index) {
                        this.editIndex = -1;
                      } else {
                      }
                    },
                  },
                },
                this.editIndex == params.index ? "取消" : "删除"
              ),
            ]);
          },
        },
      ],
      data: [],
      configForm: {},
      editIndex: -1,
      modalTitle: "",
      showModal: false,
      queryForm: {
        current: 1,
        total: 0,
        size: 10,
      },
    };
  },
  mounted() {
    this.queryConfig();
  },
  methods: {
    queryConfig() {
      this.$getRequest("/config/queryConfigList", this.queryForm).then(
        (res) => {
          this.data = res.data.result.records;
        }
      );
    },
    saveUpdate(v) {
      this.configForm.id = v.id;
      this.$putRequest("/config/updateConfig", this.configForm).then(() => {
        this.editIndex = -1;
      });
    },
    deleteConfig() {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除该记录吗?",
        onOk: () => {
          
        }
      })
    }
  },
};
</script>

<style>
</style>