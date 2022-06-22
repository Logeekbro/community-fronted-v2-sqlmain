import request from '@/utils/request'

export function getBillboard() {
  return request({
    url: '/notification',
    method: 'get'
  })
}