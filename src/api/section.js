import request from '@/utils/request'

const start = "section"

export function getSectionList() {
    return request({
      url: `/${start}/open/list`,
      method: 'get'
    })
}

export function getSectionInfoByArticleId(articleId) {
    return request({
      url: `/${start}/open/article/id/${articleId}`,
      method: 'get'
    })
}