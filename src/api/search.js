import request from '@/utils/request'

const start = "search"

// 关键词检索
export function searchByKeyword(query) {
  return request({
    url: `/${start}/open/article`,
    method: 'get',
    params: {
      keyword: query.keyword,
      current: query.pageNum,
      size: query.pageSize
    }
  })
}

// 搜素标签
export function searchByTagName(query) {
  return request({
    url: `/${start}/open/tag`,
    method: 'get',
    params: {
      tagName: query.keyword,
      current: query.pageNum,
      size: query.pageSize
    }
  })
}

// 搜索用户
export function searchByUserIdOrName(query) {
  return request({
    url: `/${start}/open/user`,
    method: 'get',
    params: {
      idOrName: query.keyword,
      current: query.pageNum,
      size: query.pageSize
    }
  })
}

// 根据标签搜索文章
export function getTopicsByTag(paramMap) {
  return request({
    url: `/${start}/open/articleByTag/${paramMap.name}`,
    method: 'get',
    params: {
      page: paramMap.page,
      size: paramMap.size
    }
  })
}
