import request from '@/utils/request'

const start = "action"

export function doLike(id) {
    return request({
      url: `/${start}/like/${id}`,
      method: 'post'
    })
}

export function isLiked(id) {
    return request({
        url: `/${start}/like/check/${id}`,
        method: 'get'
    })
}

