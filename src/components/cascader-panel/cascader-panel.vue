<template>
  <div class="cascader-panel">
    <div class="cascader-box cascader-box-first">
      <Scroll>
        <div class="cascader-item" v-for="(item, index) in data" :key="index" @click="tapFir(item)">
          <span>{{ item.title }}</span>
          <Icon type="ios-arrow-forward" v-if="item.children" />
        </div>
      </Scroll>
    </div>
    <div class="cascader-box" v-if="showSec">
      <Scroll>
        <div class="cascader-item" v-for="(item, index) in secData" :key="index" @click="tapSec(item)">
          <span>{{ item.title }}</span>
          <Icon type="ios-arrow-forward" v-if="item.children" />
        </div>
      </Scroll>
    </div>
    <div class="cascader-box" v-if="showThi">
      <Scroll>
        <div class="cascader-item" v-for="(item, index) in thiData" :key="index" @click="tapThi(item)">
          <span>{{ item.title }}</span>
          <Icon type="ios-arrow-forward" v-if="item.children" />
        </div>
      </Scroll>
    </div>
    <div class="cascader-box" v-if="showFou">
      <Scroll>
        <div class="cascader-item" v-for="(item, index) in fouData" :key="index" @click="tapFou(item)">
          <span>{{ item.title }}</span>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
export default {
  name: "CascaderPanel",
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 二级数据
      secData: [],
      showSec: false,
      // 三级数据
      thiData: [],
      showThi: false,
      // 四级数据
      fouData: [],
      showFou: false,
      // 选中Title
      checkedTitles: []
    };
  },
  methods: {
    tapFir(item) {
      this.secData = [];
      this.showSec = false;
      this.showThi = false;
      this.showFou = false;
      this.checkedTitles[0] = '';
      this.checkedTitles[1] = '';
      this.checkedTitles[2] = '';
      this.checkedTitles[3] = '';
      this.checkedTitles[0] = item.title;
      if (item.children) {
        this.showSec = true;
        this.secData = item.children;
      } else {
        this.$emit("handleChecked", item, this.checkedTitles);
      }
    },
    tapSec(item) {
      this.thiData = [];
      this.showThi = false;
      this.showFou = false;
      this.checkedTitles[1] = '';
      this.checkedTitles[2] = '';
      this.checkedTitles[3] = '';
      this.checkedTitles[1] = item.title;
      if (item.children) {
        this.showThi = true;
        this.thiData = item.children;
      } else {
        this.$emit("handleChecked", item, this.checkedTitles);
      }
    },
    tapThi(item) {
      this.fouData = [];
      this.showFou = false;
      this.checkedTitles[2] = '';
      this.checkedTitles[3] = '';
      this.checkedTitles[2] = item.title;
      if (item.children) {
        this.showFou = true;
        this.fouData = item.children;
      } else {
        this.$emit("handleChecked", item, this.checkedTitles);
      }
    },
    tapFou(item) {
      this.checkedTitles[3] = '';
      this.checkedTitles[3] = item.title;
      this.$emit("handleChecked", item, this.checkedTitles);
    },
  }
};
</script>

<style lang="less" scoped>
.cascader-panel {
  display: flex;
  margin: 16px 0;

  .cascader-box {
    width: 200px;
    border: 1px solid #e4e7ed;
    border-left: none;

    .cascader-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;

      span {
        width: 100%;
        height: 34px;
        line-height: 34px;
      }
    }

    .cascader-item:hover {
      background-color: #f5f7fa;
      cursor: pointer;
    }
  }

  .cascader-box-first {
    border-left: 1px solid #e4e7ed;
  }

  /deep/ .ivu-scroll-container {
    overflow: auto;
  }
}
</style>
