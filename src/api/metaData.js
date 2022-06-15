import request from '@/utils/request'

export function queryMetaDataByType(metaDateType) {
  return request({
    url: '/metadata/select/' + metaDateType,
    method: 'get',
    params: metaDateType
  })
}

