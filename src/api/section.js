import request from '@/utils/request'

const start = "section"

// 获取所有分区列表
export function getSectionList() {
    return request({
      url: `/${start}/open/list`,
      method: 'get'
    })
}

// 通过文章id获取分区信息
export function getSectionInfoByArticleId(articleId) {
    return request({
      url: `/${start}/open/article/id/${articleId}`,
      method: 'get'
    })
}

// 根据分区id获取对应分区的文章列表
export function getArticleListBySectionId(current, size, sectionId) {
  return request({
    url: `/${start}/open/articleList/${sectionId}`,
    method: 'get',
    params: {
      current: current,
      size: size
    }
  })
}

// 根据分区id获取分区名称
export function getSectionNameBySectionId(sectionId) {
  return request({
    url: `/${start}/open/sectionName/id/${sectionId}`,
    method: 'get'
  })
}