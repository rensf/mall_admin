<template>
  <div>
    <div class="header">
      <div class="action">
        <Input class="action-250"></Input>
        <Button class="action-btn"></Button>
        <Button class="action-btn"></Button>
      </div>
    </div>
    <div class="content">
      <Table :cloumns="cloumns" :data="data" border></Table>
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
      cloumns: [],
      data: [],
      queryForm: {
        size: 10,
        total: 0,
        current: 1,
      },
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
</style>