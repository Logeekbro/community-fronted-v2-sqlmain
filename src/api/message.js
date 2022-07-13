import request from '@/utils/request'
import store from '@/store'

const start = "message"

// 发送消息
export function sendMessage(message) {
    message.userToken = store.getters.token
    return request({
        url: `/${start}/send`,
        method: 'post',
        data: message
    })
}

// 获取用户所有已读消息
export function getAllMessage() {
    return request({
        url: `/${start}/all/${store.getters.token}`,
        method: 'get'
    })
}

// 获取所有未读消息
export function getAllUnReadMessage() {
    return request({
        url: `/${start}/unRead/all/${store.getters.token}`,
        method: 'get',
    })
}

// 告诉后端消息已读取
export function updateReadStatus(senderId) {
    return request({
        url: `/${start}/hasRead/${senderId}/${store.getters.token}`,
        method: 'put',
    })
}

// 获取所有未读消息数
export function getAllUnReadCount() {
    return request({
        url: `/${start}/unReadCount/all/${store.getters.token}`,
        method: 'get',
    })
}