import request from '@/utils/request'

const start = "tag"

export function getTagSetById(articleId) {
    return request({
      url: `/${start}/${articleId}`,
      method: 'get'
    })
}


