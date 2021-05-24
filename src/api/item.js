import request from '@/utils/request'

export function tableList(data) {
  return request({
    url: '/userInfo/find',
    method: 'POST',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: '/userInfo/toggle',
    method: 'POST',
    data
  })
}

export function editItem(data) {
  return request({
    url: '/userInfo/save',
    method: 'POST',
    data
  })
}
