// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
import config from '@/config'
import { postRequest, putRequest, deleteRequest, getRequest } from '@/api'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'

Vue.use(iView)
Vue.use(TreeTable)
Vue.use(VOrgTree)
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * @description 全局注册请求方式
 */
Vue.prototype.$postRequest = postRequest
Vue.prototype.$putRequest = putRequest
Vue.prototype.$deleteRequest = deleteRequest
Vue.prototype.$getRequest = getRequest
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
