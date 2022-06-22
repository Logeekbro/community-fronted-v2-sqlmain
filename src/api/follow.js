import request from '@/utils/request'
import store from '@/store'

const userToken = store.getters.token
const userId = store.getters.user.userId

// 关注
export function follow(id) {
  return request(({
    url: `/follow/${id}/${userToken}`,
    method: 'post'
  }))
}

// 取消关注
export function unFollow(id) {
  return request(({
    url: `/follow/${id}/${userToken}`,
    method: 'delete'
  }))
}

// 验证是否关注
export function hasFollow(topicUserId) {
  return request(({
    url: `/follow/check/${topicUserId}/${userId}`,
    method: 'get'
  }))
}

// 获取关注人数
export function getFollowerCount(userId) {
  return request(({
    url: `/follow/count/${userId}`,
    method: 'get'
  }))
}
