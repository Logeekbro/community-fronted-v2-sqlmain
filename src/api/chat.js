import request from '@/utils/request'
import store from '@/store'

const start = "chat"

let userToken = store.getters.token

// 创建聊天
export function createChat(targetId) {
    return request({
        url: `/${start}/${store.getters.token}/${targetId}`,
        method: 'post'
    })
}

// 获取用户聊天列表
export function getChatList() {
    return request({
        url: `/${start}/list/${store.getters.token}`,
        method: 'get'
    })
}

// 获取聊天基础信息
export function getChatInfo(chatId) {
    return request({
        url: `/${start}/${chatId}/${store.getters.token}`,
        method: 'get'
    })
}