import request from '@/utils/request'
import store from '@/store'


// 添加回复
export function addReply(commentId, content, target){
    return request(({
        url:`/reply/${commentId}`,
        method: "post",
        data: {
            target: target,
            content: content
        }
    }))
}

// 获取回复列表
export function getReplyList(commentId, current, size){
    const params = {
        current: current,
        size: size
    }
    return request(({
        url: `/reply/list/${commentId}`,
        method: "get",
        params: params
    }))
}

// 删除回复
export function deleteReplyById(replyId){
    return request(({
        url: `/reply/${replyId}`,
        method: "delete"
    }))
}

// 获取回复数量
export function getReplyCount(commentId){
    return request(({
        url: `/reply/count/${commentId}`,
        method: "get"
    }))
}