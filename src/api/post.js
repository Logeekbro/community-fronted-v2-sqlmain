import request from '@/utils/request'
import store from '@/store'


const start = "article"

// 用户主页文章列表
export function getInfoByName(username, page, size) {
  return request({
    url: `/${start}/user/list`,
    method: 'get',
    params: {
      userId: username,
      current: page,
      size: size
    }
  })
}

// 获取首页文章
export function getList(pageNo, size, type) {
  return request(({
    url: `/${start}/open/${type}`,
    method: 'get',
    params: { current: pageNo, size: size }
  }))
}

// 发布
export function post(topic) {
  return request({
    url: `/${start}/`,
    method: 'post',
    data: topic
  })
}

// 获取文章详情
export function getTopicDetail(id) {
  return request({
    url: `/${start}/open/detail/${id}`,
    method: 'get',
  })
}

// 获取详情页推荐
export function getRecommendTopics(id) {
  return request({
    url: `/${start}/recommend`,
    method: 'get',
    params: {
      topicId: id
    }
  })
}

// 更新
export function update(topic) {
  return request({
    url: `/${start}/`,
    method: 'put',
    data: topic
  })
}

// 删除
export function deleteTopic(id) {
  return request({
    url: `/${start}/${id}`,
    method: 'delete',
  })
}

// 用户发表的文章数量
export function getArticleCount(id) {
  return request({
    url: `/${start}/open/count/${id}`,
    method: 'get',
  })
}

// 用户浏览记录

// java版
// export function getUserHistory(current, size){
//   const params = {
//     current: current,
//     size: size
//   }
//   return request({
//     url: `/${start}/history/${store.getters.token}`,
//     method: 'get',
//     params: params
//   })
// }

// sql版
export function getUserHistory(current, size){
  const params = {
    current: current,
    size: size
  }
  return request({
    url: `/view/history/${store.getters.token}`,
    method: 'get',
    params: params
  })
}


