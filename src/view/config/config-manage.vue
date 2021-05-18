<template>
  <div>
    <div class="header">
      <div class="action">
        <Input class="action-250" placeholder="请输入模块名称" v-model="queryForm.application"></Input>
        <Button class="action-btn" type="primary" @click="queryConfig">查询</Button>
        <Button class="action-btn" type="success" @click="addConfig">添加</Button>
      </div>
    </div>
    <div class="content">
      <Table
        :columns="columns"
        :data="data"
        @on-row-dblclick="updateConfig"
        border
      ></Table>
      <Page
        class="page"
        :page-size="queryForm.size"
        :total="queryForm.total"
        :current="queryForm.current"
      ></Page>
    </div>
    <Modal
      :styles="{ top: '30px' }"
      title="添加配置"
      v-model="showModal"
      :mask-closable="false"
      @on-cancel="cancelCommit"
    >
      <Form
        ref="configForm"
        :model="configForm"
        :label-width="80"
        :label-colon="true"
      >
        <FormItem label="系统名称" prop="application">
          <Input
            v-model="configForm.application"
            placeholder="请输入系统名称"
          ></Input>
        </FormItem>
        <FormItem label="系统环境" prop="profile">
          <Input
            v-model="configForm.profile"
            placeholder="请输入系统环境"
          ></Input>
        </FormItem>
        <FormItem label="读取分支" prop="label">
          <Input
            v-model="configForm.label"
            placeholder="请输入读取分支"
          ></Input>
        </FormItem>
        <FormItem label="键" prop="key">
          <Input v-model="configForm.key" placeholder="请输入键"></Input>
        </FormItem>
        <FormItem label="值" prop="value">
          <Input v-model="configForm.value" placeholder="请输入值"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelCommit">取消</Button>
        <Button type="primary" @click="confirmCommit">确定</Button>
      </div>
    </Modal>
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
                        params.row.value = this.configForm.value;
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
                        this.deleteConfig();
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
    addConfig() {
      this.showModal = true;
    },
    confirmCommit() {
      this.$postRequest("/config/addConfig", this.configForm).then((res) => {
        this.showModal = false;
        this.$refs["configForm"].resetFields();
      });
    },
    cancelCommit() {
      this.showModal = false;
      this.$refs["configForm"].resetFields();
    },
    updateConfig(row, index) {
      this.editIndex = index;
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
          this.$deleteRequest("/config/deleteConfig", this.configForm).then(
            () => {
              this.queryConfig();
            }
          );
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>