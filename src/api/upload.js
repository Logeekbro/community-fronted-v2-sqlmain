import request from '@/utils/request'
import store from '@/store'

const userToken = store.getters.token

const headers = {
    'Content-Type': 'multipart/form-data'
}

export function uploadAvatar(file, haveAvatar) {
    let data = new FormData()
    data.append("userToken", userToken)
    data.append("file", file)
    data.append("haveAvatar", haveAvatar)
    return request({
      url: '/upload/avatar',
      method: 'post',
      headers: headers,
      data: data
    })
  }