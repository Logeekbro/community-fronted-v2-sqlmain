import request from '@/utils/request'
import store from '@/store'

// 列表
const userToken = store.getters.token
const start = "article"

// 用户主页
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

export function getList(pageNo, size, type) {
  return request(({
    url: `/${start}/${type}`,
    method: 'get',
    params: { current: pageNo, size: size }
  }))
}

// 发布
export function post(topic) {
  topic.userToken = userToken;
  return request({
    url: `/${start}/`,
    method: 'post',
    data: topic
  })
}

// 浏览
export function getTopicDetail(id) {
  return request({
    url: `/${start}/detail/${id}`,
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
  topic.userToken = userToken
  return request({
    url: `/${start}/`,
    method: 'put',
    data: topic
  })
}

export function deleteTopic(id) {
  const data = {
    userToken: userToken
  }
  return request({
    url: `/${start}/${id}`,
    method: 'delete',
    params: data
  })
}

export function getArticleCount(id) {
  return request({
    url: `/${start}/count/${id}`,
    method: 'get',
  })
}

// 用户浏览记录
export function getUserHistory(current, size){
  const params = {
    current: current,
    size: size
  }
  return request({
    url: `/${start}/history/${userToken}`,
    method: 'get',
    params: params
  })
}
