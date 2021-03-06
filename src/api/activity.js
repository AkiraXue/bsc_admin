import request from '@/utils/request'
export function tableList(data) {
  return request({
    url: '/activity/find',
    method: 'POST',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: '/activity/toggle',
    method: 'POST',
    data
  })
}

export function editItem(data) {
  return request({
    url: '/activity/save',
    method: 'POST',
    data
  })
}
