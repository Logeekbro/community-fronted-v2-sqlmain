import request from '@/utils/request'
import store from '@/store'

const start = "comment"

export function fetchCommentsByTopicId(articleId, current, size) {
  const params = {
    current: current,
    size: size
  }
  return request({
    url: `/${start}/${articleId}`,
    method: 'get',
    params: params
  })
}

// 添加评论
export function pushComment(data) {
  return request({
    url: `/${start}/`,
    method: 'post',
    data: data
  })
}

// 删除评论
export function deleteComment(id) {
  return request({
    url: `/${start}/${id}`,
    method: 'delete',
  })
}

