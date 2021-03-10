import axios from 'axios'
import store from '@/store'
import {
  Notice
} from 'view-design'

const service = axios.create({
  baseURL: '',
  timeout: 0,
})

service.interceptors.request.use(config => {
  if (store.state.token)
    config.headers.token = store.state.token
  return config
})

service.interceptors.response.use(response => {
  console.log(response)
  let code = response.data.code
  if (code === null) {

  } else if (code === '0') {
    if (response.config.method !== 'get') {
      Notice.success({
        title: 'Tip',
        desc: '操作成功！',
        duration: 1,
      })
    }
    return response
  }
})

export default service
