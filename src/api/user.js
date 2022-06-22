import request from '@/utils/request'
import store from '@/store'

// 从store中获取token
const userToken = store.getters.token;


// 用户公开信息
export function getOpenInfo(userId){
  return request({
    url: `/user/openInfo/${userId}`,
    method: 'get',
  })
}

// 用户关注列表
export function getFollows(userId){
  return request({
    url: `/user/followList/${userId}`,
    method: "get"
  })
}

// 用户设置中心信息
export function getInfo() {
  const params = {
    userToken: userToken
  }
  return request({
    url: `/user/info/detail`,
    method: 'get',
    params: params
  })
}
// 更新
export function update(user) {
  user.userToken = userToken
  return request({
    url: '/user/info',
    method: 'put',
    data: user
  })
}

// 修改密码
export function updatePassword(passwordForm){
  return request({
    url: `/user/password/${passwordForm.oldPassword}/${passwordForm.newPassword}/${userToken}`,
    method: 'put',
  })
}


