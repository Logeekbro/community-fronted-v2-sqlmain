import request from '@/utils/request'
import store from '@/store'

// 关注
export function follow(id) {
  return request(({
    url: `/follow/${id}`,
    method: 'post'
  }))
}

// 取消关注
export function unFollow(id) {
  return request(({
    url: `/follow/${id}`,
    method: 'delete'
  }))
}

// 验证是否关注
export function hasFollow(topicUserId) {
  return request(({
    url: `/follow/check/${topicUserId}/${store.getters.user.userId}`,
    method: 'get'
  }))
}

// 获取关注人数
export function getFollowerCount(userId) {
  return request(({
    url: `/follow/open/count/${userId}`,
    method: 'get'
  }))
}
