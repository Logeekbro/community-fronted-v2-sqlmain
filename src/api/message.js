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

// 初始化聊天
export function initChat(targetId) {
    return request({
        url: `/${start}/init/${targetId}/${store.getters.token}`,
        method: 'post'
    })
}

// 获取用户所有消息
export function getAllMessage() {
    return request({
        url: `/${start}/all/${store.getters.token}`,
        method: 'get'
    })
}

// 获取聊天列表
export function getTargetList() {
    return request({
        url: `/${start}/targetList/${store.getters.token}`,
        method: 'get'
    })
}

// 获取消息列表
export function getMessageList(targetId, page) {
    return request({
        url: `/${start}/list/${targetId}/${store.getters.token}`,
        method: 'get',
        params: {
            current: page.current,
            size: page.size
        }
    })
}

// 获取某个聊天的未读消息
export function getLatestMessage(senderId) {
    return request({
        url: `/${start}/unRead/${senderId}/${store.getters.token}`,
        method: 'get',
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

// 根据id获取未读消息
export function getUnReadCountById(id) {
    return request({
        url: `/${start}/unReadCount/${id}/${store.getters.token}`,
        method: 'get',
    })
}