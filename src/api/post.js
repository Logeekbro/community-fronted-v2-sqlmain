import request from '@/utils/request'
import store from '@/store'


const start = "article"

const headers = {
  'Content-Type': 'multipart/form-data'
}

// 用户主页文章列表
export function getInfoByName(username, page, size) {
  return request({
    url: `/${start}/open/user/list`,
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
  let data = new FormData()
  data.append("title", topic.title)
  data.append("file", topic.file)
  data.append("content", topic.content)
  data.append("sectionId", topic.sectionId)
  data.append("summary", topic.summary)
  data.append("tags", JSON.stringify(topic.tags))
  data.append("needReview", topic.needReview)
  return request({
    url: `/${start}/`,
    method: 'post',
    data: data,
    headers: headers
  })
}

// 获取文章详情
export function getTopicDetail(id, isReEdit=false) {
  return request({
    url: `/${start}/open/detail/${id}`,
    method: 'get',
    params: {isReEdit: isReEdit}
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
  let data = new FormData()
  data.append("articleId", topic.articleId)
  data.append("authorId", topic.authorId)
  data.append("title", topic.title)
  data.append("sectionId", topic.sectionId)
  data.append("file", topic.file)
  data.append("content", topic.content)
  data.append("summary", topic.summary)
  data.append("needReview", topic.needReview)
  return request({
    url: `/${start}/`,
    method: 'put',
    data: data,
    headers: headers
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

// 获取首页置顶文章
export function getIndexTop() {
  return request({
    url: `/${start}/open/index/top`,
    method: 'get'
  })
}

// 通过文章id获取文章标题
export function getTitleByArticleId(articleId) {
  return request({
    url: `/${start}/open/title/${articleId}`,
    method: 'get'
  })
}

// 获取活跃作者信息
export function getActiveAuthors(n) {
  return request({
    url: `/${start}/open/mostActiveAuthors/${n}`,
    method: 'get'
  })
}

// 获取待审核的文章列表
export function getNeedReviewArticleList() {
  return request({
    url: `/${start}/admin/needReviewList`,
    method: 'get'
  })
}

// 更新文章审核状态
export function updateReviewArticleStatus(articleId, isPass) {
  return request({
    url: `/${start}/admin/review/id/${articleId}`,
    method: 'put',
    params: {
      isPass: isPass
    }
  })
}

// 根据用户id获取该用户待审核的文章列表
export function getNeedReviewArticleListByUserId() {
  return request({
    url: `/${start}/needReviewList`,
    method: 'get'
  })
}

// 获取审核未通过的文章列表
export function getUnPassReviewListByUserId() {
  return request({
    url: `/${start}/unPassReviewList`,
    method: 'get'
  })
}


