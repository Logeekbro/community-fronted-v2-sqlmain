import request from '@/utils/request'

const start = "permission"

// 获取用户角色id列表
export function getUserRoleIdList() {
    return request({
        url: `/${start}/roleIdList`,
        method: 'get'
    })
}