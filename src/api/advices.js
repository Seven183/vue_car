import request from '@/utils/request'

export function addAdvice(data) {
  return request({
    url: '/advice/addAdvice',
    method: 'post',
    data
  })
}

export function deleteAdvice(advicesId) {
  return request({
    url: '/advice/deleteAdvice/' + advicesId,
    method: 'get',
    params: advicesId
  })
}

export function updateAdvice(data) {
  return request({
    url: 'advice/updateAdvice',
    method: 'post',
    data
  })
}

export function selectAdvicesById(advicesId) {
  return request({
    url: 'advice/select/' + advicesId,
    method: 'get',
    params: advicesId
  })
}

export function queryLikeAdvices(data) {
  return request({
    url: 'advice/queryLikeAdvices',
    method: 'get',
    params: data
  })
}

export function allAdvices(data) {
  return request({
    url: 'advice/allAdvices',
    method: 'get',
    params: data
  })
}

