import request from '@/utils/request'

export function fileUpload(data) {
  return request({
    url: '/fileUpload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data', // 默认值
    },
    data
  })
}

