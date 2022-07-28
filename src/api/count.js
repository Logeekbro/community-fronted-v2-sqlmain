import request from '@/utils/request'

const start = "count"

export function getLikeCount(id) {
    return request(({
        url: `/${start}/open/like/${id}`,
        method: 'get'
    }))
}

export function getCommentCount(id) {
    return request(({
        url: `/${start}/open/comment/${id}`,
        method: 'get'
    }))
}

export function getViewCount(id) {
    return request(({
        url: `/${start}/open/view/${id}`,
        method: 'get'
    }))
}