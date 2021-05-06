<template>
  <div>
    <div class="header">
      <div class="action">
        <Input class="action-250" placeholder="请输入订单编号"></Input>
        <Button class="action-btn" type="primary">查询</Button>
        <Button class="action-btn" type="success">添加</Button>
      </div>
    </div>
    <div class="content">
      <Table :columns="columns" :data="data" border></Table>
      <Page class="page"></Page>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { type: "index", title: "序号", align: "center", width: 70 },
        { title: "订单编号", key: "orderNo", align: "center", width: 200 },
        { title: "订单地址", key: "orderAddress", align: "center" },
        { title: "订单时间", key: "orderTime", align: "center", width: 250 },
        { title: "操作", key: "action", align: "center", width: 200 },
      ],
      data: [],
    };
  },
};
</script>

<style lang="less" scoped>
</style>