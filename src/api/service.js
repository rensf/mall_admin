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
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  } else {
    config.headers.Authorization = "Basic bWFsbC1hZG1pbg==" // base64明文：mall-amin
  }
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
  } else {
    let msg = response.data.msg
    Notice.error({
      title: 'Tip',
      desc: msg,
      duration: 3,
    })
  }
})

export default service
