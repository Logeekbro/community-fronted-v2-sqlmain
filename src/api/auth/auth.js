import request from '@/utils/request'
import store from '@/store'

// 注册
export function userRegister(userDTO) {
  return request({
    url: '/user/register',
    method: 'post',
    data: userDTO
  })
}

// 前台用户登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}
// 登录后获取前台用户信息
export function getUserInfo() {
  const params = {
    userToken: store.getters.token
  }
  return request({
    url: '/user/info',
    method: 'get',
    params: params
  })
}
// 前台用户注销
export function logout(token) {
  const params = {
    userToken: token
  }
  return request({
    url: '/user/logout',
    method: 'delete',
    params: params
  })
}