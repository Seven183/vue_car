import request from '@/utils/request'

export function fileUpload(data) {
  return request({
    url: '/fileUpload',
    method: 'post',
    data
  })
}

export function fileDelete(imageName) {
  return request({
    url: '/fileDelete',
    method: 'get',
    params: { imageName }
  })
}

