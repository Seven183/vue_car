import request from '@/utils/request'

export function queryMetaDataByType(metaDateType) {
  return request({
    url: '/matadata/select/' + metaDateType,
    method: 'get',
    params: metaDateType
  })
}

