import request from '@/utils/request'
import store from '@/store'

const userToken = store.getters.token
const userId = store.getters.user.userId

// 增加阅读量
export function addView(id) {
  return request(({
    url: `/view/${id}/${userToken}`,
    method: 'post'
  }))
}


// 获取阅读量
export function getViewCount(articleId) {
  return request(({
    url: `/view/count/${articleId}`,
    method: 'get'
  }))
}