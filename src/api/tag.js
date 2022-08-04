import request from '@/utils/request'

const start = "tag"

// 获取文章的标签列表
export function getTagSetById(articleId) {
    return request({
      url: `/${start}/${articleId}`,
      method: 'get'
    })
}

// 获取模糊查询标签名的标签列表
export function getSimilarTagListByTagName(tagName) {
  return request({
    url: `/${start}/list/similarTagName`,
    method: 'get',
    params: {
      tagName: tagName
    }
  })
}
