import request from '@/utils/request'
import store from '@/store'

const start = "view"

// 记录浏览历史
export function addView(id) {
  return request(({
    url: `/${start}/${id}/${store.getters.token}`,
    method: 'post'
  }))
}

// 删除浏览历史
export function deleteView(id){
  return request(({
    url: `/${start}/${id}/${store.getters.token}`,
    method: 'delete'
  }))
}

// 删除所有浏览历史
export function deleteAll() {
  return request(({
    url: `/${start}/all/${store.getters.token}`,
    method: 'delete'
  }))
}

// 通过日期获取浏览记录
export function getUserHistoryByDate(dt) {
  return request(({
    url: `/${start}/history/date/${store.getters.token}`,
    method: 'get',
    params: {
      targetDate: dt
    }
  }))
}