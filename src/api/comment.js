import request from '@/utils/request'
import store from '@/store'

const userToken = store.getters.token

export function fetchCommentsByTopicId(articleId, current, size) {
  const params = {
    current: current,
    size: size
  }
  return request({
    url: `/comment/${articleId}`,
    method: 'get',
    params: params
  })
}

export function pushComment(data) {
  return request({
    url: `/comment/${userToken}`,
    method: 'post',
    data: data
  })
}

export function deleteComment(id) {
  return request({
    url: `/comment/${id}/${userToken}`,
    method: 'delete',
  })
}

