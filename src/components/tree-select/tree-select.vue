<template>
  <Select
    ref="select"
    class="tree-select"
    v-bind="$attrs"
    @on-change="handleChange"
    multiple
  >
    <tree-select-tree
      :selectedArray="value"
      :data="data"
      @on-clear="handleClear"
      @on-check="handleTreeCheck"
    ></tree-select-tree>
  </Select>
</template>

<script>
import Emitter from 'iview/src/mixins/emitter'
import TreeSelectTree from './tree-select-tree.vue'
export default {
  name: 'TreeSelect',
  mixins: [Emitter],
  components: {
    TreeSelectTree
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      isChangedByTree: true,
      isInit: true
    }
  },
  provide () {
    return {
      parent: this
    }
  },
  methods: {
    handleChange (selected) {
      if (!this.isChangedByTree) this.$emit('input', selected)
      this.isChangedByTree = false
    },
    handleTreeCheck (selectedArray) {
      this.isChangedByTree = true
      this.$emit('input', selectedArray.map(item => item.id))
    },
    handleClear () {
      this.$refs.select.reset()
    }
  },
}
</script>

<style lang="less">
.tree-select {
  .ivu-select-dropdown {
    padding: 0 6px;
  }
}
</style>
