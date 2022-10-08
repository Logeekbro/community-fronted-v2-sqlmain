import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import { MyMsg } from './message'

// 1.创建axios实例
const service = axios.create({
  // 公共接口--,url = base url + request url
  baseURL: process.env.VUE_APP_SERVER_URL,

  // baseURL: 'https://api.example.com',
  // 超时时间 单位是ms，这里设置了10s的超时时间
  timeout: 10 * 1000
})

// 2.请求拦截器request interceptor
service.interceptors.request.use(
  config => {
    // 发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
    // 注意使用token的时候需要引入cookie方法或者用本地localStorage等方法，推荐js-cookie
    if (store.getters.token) {
      // config.params = {'token': token}    // 如果要求携带在参数中
      // config.headers.token = token;       // 如果要求携带在请求头中
      // bearer：w3c规范
      config.headers['userToken'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 设置cross跨域 并设置访问权限 允许跨域携带cookie信息,使用JWT可关闭
service.defaults.withCredentials = false

// 设置用户未登录时的弹窗延时，避免短时间多次弹窗
const popLayout = 5 * 1000 * 60

service.interceptors.response.use(
  // 接收到响应数据并成功后的一些共有的处理，关闭loading等
  response => {
    const res = response.data
    // 如果自定义代码不是200，则将其判断为错误。
    if (res.code !== 200) {
      // 401: Token失效;
      if (res.code === 401) {
        const currentTime = new Date().getTime()
        const popTime = sessionStorage.getItem('popTime') == null ? 0 : sessionStorage.getItem('popTime')
        if (currentTime - popTime > popLayout) {
          sessionStorage.setItem('popTime', currentTime)
          // 重新登录
          // MessageBox.confirm('您可以留在当前页面，或登录后体验完整功能', res.message, {
          //   confirmButtonText: '去登录',
          //   cancelButtonText: '留下',
          //   type: 'warning',
          //   center: true
          // }).then(() => {
          //   removeToken();
          //   window.location.href = '/login'
          // })
        }

      }
      else if (res.code === 404) {
        setTimeout(window.location.href = "/404", 1500)
      }
      else if (res.code === 400) {
        MyMsg.error("参数有误", 1500)
      }
      else {
        MyMsg.error(res.message || 'Error', 2000)

      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    /** *** 接收到异常响应的处理开始 *****/
    const err = error.toJSON()
    if(err.message == "Network Error") {
      MyMsg.error("网络异常，请检查后重试", 2000)
    }
    else if (error.response != null && error.response.status == 400) {
      MyMsg.error("参数有误", 2000)
    }
    else if (error.response != null && error.response.status == 500) {
      MyMsg.error("服务器异常!", 2000)
    }
    else {
      MyMsg.error("客户端异常：" + err.message, 2000)
    }

    return Promise.reject(error)
  }
)
export default service