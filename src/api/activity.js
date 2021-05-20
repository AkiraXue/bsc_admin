import request from '@/utils/request'
export function tableList(data) {
  return request({
    url: '/activity/find',
    method: 'post',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: '/activity/deleteById',
    method: 'post',
    data
  })
}
export function editItem(data) {
  return request({
    url: '/activity/save',
    method: 'post',
    data
  })
}
