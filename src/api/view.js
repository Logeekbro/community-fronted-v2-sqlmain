import request from '@/utils/request'
import store from '@/store'

const userToken = store.getters.token
const userId = store.getters.user.userId
const start = "view"

// 记录浏览历史
export function addView(id) {
  return request(({
    url: `/${start}/${id}/${userToken}`,
    method: 'post'
  }))
}

// 删除浏览历史
export function deleteView(id){
  return request(({
    url: `/${start}/${id}/${userToken}`,
    method: 'delete'
  }))
}

// 删除所有浏览历史
export function deleteAll() {
  return request(({
    url: `/${start}/all/${userToken}`,
    method: 'delete'
  }))
}